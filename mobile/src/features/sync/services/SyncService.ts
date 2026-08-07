import { Result } from "@core/utils/Result";
import {
  CommunicationError,
  ChecksumMismatchError,
} from "@core/errors/CommunicationError";
import { Logger } from "@core/logger/Logger";
import { DeviceTransport } from "../../devices/transport/DeviceTransport";
import { HttpDeviceTransport } from "../../devices/transport/HttpDeviceTransport";
import { DeviceCaptureMetadata } from "../../devices/models/DeviceStatus";
import {
  CaptureTransferStatus,
  TransferProgressEvent,
} from "../../devices/models/CaptureTransferJob";
import {
  MAX_TRANSFER_RETRY_ATTEMPTS,
  TRANSFER_RETRY_BASE_DELAY_MS,
  TRANSFER_RETRY_MAX_DELAY_MS,
  API_BASE_PATH,
  DEVICE_HTTP_PORT,
  DEV_STATIC_TOKEN,
} from "../../devices/constants/ApiCompatibility";
import { Container } from "@core/di/Container";
import { CaptureRepository } from "../../captures/repositories/CaptureRepository";
import { SyncRepository } from "../repositories/SyncRepository";
import { NewCapture } from "@infra/database/schema/captures";
import * as FileSystem from "expo-file-system";
export type SyncEventListener = (event: SyncEvent) => void;

export type SyncEvent =
  | { type: "sync_started"; captureCount: number }
  | { type: "transfer_progress"; progress: TransferProgressEvent }
  | { type: "transfer_complete"; transactionId: string }
  | { type: "transfer_failed"; transactionId: string; error: CommunicationError }
  | { type: "sync_complete"; transferred: number; failed: number }
  | { type: "sync_error"; error: CommunicationError };

export class SyncService {
  private readonly logger: Logger;
  private readonly listeners = new Set<SyncEventListener>();
  private isProcessingQueue = false;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  subscribe(listener: SyncEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Main entry point to sync from a device.
   * 1. Fetches metadata from device.
   * 2. Upserts placeholders in local DB.
   * 3. Enqueues missing captures into the sync queue.
   * 4. Triggers queue processing.
   */
  async syncFromDevice(transport: DeviceTransport): Promise<Result<void, CommunicationError>> {
    const listResult = await transport.get<DeviceCaptureMetadata[]>("/captures");
    if (!listResult.isSuccess) {
      const error = listResult.getErrorOrThrow();
      this.logger.error("[SYNC] Failed to fetch capture list", error);
      this._emit({ type: "sync_error", error });
      return Result.fail(error);
    }

    const captures = listResult.getValueOrThrow();
    this.logger.info(`[SYNC] Sync started: ${captures.length} pending captures on device`);
    this._emit({ type: "sync_started", captureCount: captures.length });

    const captureRepo = Container.getInstance().resolve<CaptureRepository>("CaptureRepository");
    const syncRepo = Container.getInstance().resolve<SyncRepository>("SyncRepository");

    // Build a map from local DB id → DeviceCaptureMetadata so processQueue
    // never needs to re-fetch the list from the device (which would fail if a
    // capture was already deleted after a prior successful download).
    const metadataByLocalId = new Map<number, DeviceCaptureMetadata>();

    for (const metadata of captures) {
      // 1. Check if we already have this capture locally
      const existing = await captureRepo.findByUuid(metadata.transaction_id);
      
      let localCaptureId: number;
      if (existing.isSuccess && existing.getValueOrThrow()) {
        const cap = existing.getValueOrThrow()!;
        if (cap.syncState === "synced") {
          // Already synced, skip
          continue;
        }
        localCaptureId = cap.id;
      } else {
        // 2. Create placeholder in local DB
        const newCap: NewCapture = {
          uuid: metadata.transaction_id,
          transcript: metadata.transcript,
          createdAt: new Date(metadata.captured_timestamp),
          updatedAt: new Date(),
          syncState: "pending",
        };
        const insertResult = await captureRepo.create(newCap);
        if (!insertResult.isSuccess) {
          this.logger.warn(`[SYNC] Failed to create local placeholder for ${metadata.transaction_id}`);
          continue;
        }
        localCaptureId = insertResult.getValueOrThrow().id;
      }

      // 3. Cache the full device metadata so the queue processor has it
      metadataByLocalId.set(localCaptureId, metadata);

      // 4. Enqueue it in the sync queue
      await syncRepo.enqueue({
        entity: "capture_download",
        entityId: localCaptureId,
        operation: "insert",
        status: "pending"
      });
    }

    // 5. Kick off queue processing with cached metadata (no device re-fetch needed)
    this.processQueue(transport, metadataByLocalId).catch(e => {
       this.logger.error("[SYNC] Unhandled error during queue processing", e);
    });

    return Result.ok(undefined);
  }

  /**
   * Processes the local sync queue until empty.
   */
  async processQueue(
    transport: DeviceTransport,
    metadataByLocalId: Map<number, DeviceCaptureMetadata> = new Map(),
  ): Promise<void> {
    if (this.isProcessingQueue) {
      this.logger.debug("[SYNC] Queue is already processing.");
      return;
    }

    this.isProcessingQueue = true;
    const syncRepo = Container.getInstance().resolve<SyncRepository>("SyncRepository");
    const captureRepo = Container.getInstance().resolve<CaptureRepository>("CaptureRepository");

    try {
      let pendingResult = await syncRepo.pending();
      let pendingItems = pendingResult.isSuccess ? pendingResult.getValueOrThrow() : [];
      let transferred = 0;
      let failed = 0;

      while (pendingItems.length > 0) {
        const item = pendingItems[0]!;
        await syncRepo.markRunning(item.id);

        if (item.entity === "capture_download") {
          const capResult = await captureRepo.findById(item.entityId);
          if (capResult.isSuccess && capResult.getValueOrThrow()) {
            const capture = capResult.getValueOrThrow()!;

            // Use the metadata we already fetched during discovery.
            // This avoids re-fetching the /captures list from the device —
            // which would fail if the capture was already deleted after a
            // prior successful download, causing spurious "failed" marks.
            const metadata = metadataByLocalId.get(item.entityId);

            if (!metadata) {
              // Queue item was enqueued outside of this sync session (e.g.
              // from a previous app session). Fall back to a targeted device
              // list fetch so we can still attempt the download.
              this.logger.debug(`[SYNC] No cached metadata for ${capture.uuid}, fetching from device...`);
              const listResult = await transport.get<DeviceCaptureMetadata[]>("/captures");
              const fallbackMeta = listResult.isSuccess
                ? listResult.getValueOrThrow().find(m => m.transaction_id === capture.uuid)
                : undefined;

              if (!fallbackMeta) {
                // Capture genuinely no longer exists on device — skip gracefully.
                this.logger.warn(`[SYNC] Capture ${capture.uuid} not found on device, skipping.`);
                await captureRepo.update(capture.id, { syncState: "failed" });
                await syncRepo.markFailed(item.id);
                failed++;
              } else {
                const transferResult = await this._transferWithRetry(transport, fallbackMeta);
                if (transferResult.isSuccess) {
                  await captureRepo.update(capture.id, { syncState: "synced" });
                  await syncRepo.markCompleted(item.id);
                  transferred++;
                } else {
                  await captureRepo.update(capture.id, { syncState: "failed" });
                  await syncRepo.markFailed(item.id);
                  failed++;
                }
              }
            } else {
              const transferResult = await this._transferWithRetry(transport, metadata);
              if (transferResult.isSuccess) {
                await captureRepo.update(capture.id, { syncState: "synced" });
                await syncRepo.markCompleted(item.id);
                transferred++;
              } else {
                await captureRepo.update(capture.id, { syncState: "failed" });
                await syncRepo.markFailed(item.id);
                failed++;
              }
            }
          } else {
            await syncRepo.markFailed(item.id);
            failed++;
          }
        } else if (item.entity === "capture_transcription") {
          const capResult = await captureRepo.findById(item.entityId);
          if (capResult.isSuccess && capResult.getValueOrThrow()) {
            const capture = capResult.getValueOrThrow()!;
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const audioUri = `${(FileSystem as any).documentDirectory}vaha/audio/${capture.uuid}.wav`;
            
            try {
              // Upload to device for transcription
              const uploadResult = await transport.upload<{ success: boolean; transcript: string; duration: number }>(
                "/captures/transcribe",
                audioUri,
                "audio",
                "audio/wav"
              );

              if (uploadResult.isSuccess) {
                const response = uploadResult.getValueOrThrow();
                
                // Save returned transcript back to local DB
                await captureRepo.update(capture.id, {
                  transcript: response.transcript,
                  syncState: "synced"
                });
                
                await syncRepo.markCompleted(item.id);
                transferred++;
              } else {
                this.logger.warn(`[SYNC] Transcription failed for ${capture.uuid}`);
                await syncRepo.markFailed(item.id);
                failed++;
              }
            } catch (e) {
              this.logger.error(`[SYNC] Upload error for ${capture.uuid}`, e as Error);
              await syncRepo.markFailed(item.id);
              failed++;
            }
          } else {
            await syncRepo.markFailed(item.id);
            failed++;
          }
        } else {
          await syncRepo.markFailed(item.id);
        }

        // Fetch next batch
        pendingResult = await syncRepo.pending();
        pendingItems = pendingResult.isSuccess ? pendingResult.getValueOrThrow() : [];
      }

      this._emit({ type: "sync_complete", transferred, failed });
    } finally {
      this.isProcessingQueue = false;
    }
  }

  // ---------------------------------------------------------------------------
  // Transfer Logic
  // ---------------------------------------------------------------------------

  private async _transferWithRetry(
    transport: DeviceTransport,
    metadata: DeviceCaptureMetadata,
  ): Promise<Result<void, CommunicationError>> {
    let lastError: CommunicationError | null = null;

    for (let attempt = 1; attempt <= MAX_TRANSFER_RETRY_ATTEMPTS; attempt++) {
      if (attempt > 1) {
        const delay = this._backoffDelay(attempt);
        this.logger.warn(`[SYNC] Retrying transfer ${metadata.transaction_id} (attempt ${attempt}) in ${delay}ms`);
        await this._sleep(delay);
      }

      const result = await this._transferOnce(transport, metadata, (received, total) => {
        this._emit({
          type: "transfer_progress",
          progress: {
            transactionId: metadata.transaction_id,
            totalBytes: total,
            downloadedBytes: received,
            percentage: Math.round((received / total) * 100),
            status: "downloading" satisfies CaptureTransferStatus,
          },
        });
      });

      if (result.isSuccess) {
        this._emit({ type: "transfer_complete", transactionId: metadata.transaction_id });
        return Result.ok(undefined);
      }

      lastError = result.getErrorOrThrow();
    }

    const finalError = lastError ?? new CommunicationError(`Transfer of ${metadata.transaction_id} failed`);
    this._emit({ type: "transfer_failed", transactionId: metadata.transaction_id, error: finalError });
    return Result.fail(finalError);
  }

  /**
   * Downloads a single capture audio file directly to the filesystem using
   * expo-file-system downloadAsync. This avoids the broken ArrayBuffer →
   * base64 string pipeline which causes OOM / silent failures on large WAV
   * files in React Native.
   */
  private async _transferOnce(
    transport: DeviceTransport,
    metadata: DeviceCaptureMetadata,
    onProgress: (received: number, total: number) => void,
  ): Promise<Result<void, CommunicationError>> {
    try {
      // Use deviceIp exposed by HttpDeviceTransport for direct binary download
      const deviceIp = (transport as HttpDeviceTransport).deviceIp;

      if (!deviceIp) {
        return Result.fail(new CommunicationError("Cannot resolve device IP for direct download"));
      }

      const audioDir = `${FileSystem.documentDirectory}vaha/audio/`;
      await FileSystem.makeDirectoryAsync(audioDir, { intermediates: true });

      const localUri = `${audioDir}${metadata.transaction_id}.wav`;
      const remoteUrl = `http://${deviceIp}:${DEVICE_HTTP_PORT}${API_BASE_PATH}/captures/${metadata.transaction_id}`;

      this.logger.info(`[SYNC] Downloading ${metadata.transaction_id} via downloadAsync`);

      const downloadResumable = FileSystem.createDownloadResumable(
        remoteUrl,
        localUri,
        {
          headers: {
            Authorization: `Bearer ${DEV_STATIC_TOKEN}`,
          },
        },
        (downloadProgress) => {
          const received = downloadProgress.totalBytesWritten;
          const total = downloadProgress.totalBytesExpectedToWrite ?? metadata.audio_size_bytes;
          if (total > 0) onProgress(received, total);
        }
      );

      const downloadResult = await downloadResumable.downloadAsync();

      if (!downloadResult || downloadResult.status !== 200) {
        const status = downloadResult?.status ?? 0;
        return Result.fail(new CommunicationError(
          `Download failed for ${metadata.transaction_id} (HTTP ${status})`
        ));
      }

      this.logger.info(`[SYNC] Downloaded ${metadata.transaction_id} to ${localUri}`);

      // Purge from device after successful write
      const purgeResult = await transport.delete<{ success: boolean }>(
        `/captures/${metadata.transaction_id}`,
      );

      if (!purgeResult.isSuccess) {
        this.logger.warn(`[SYNC] Capture stored but device purge failed: ${metadata.transaction_id}`);
      }

      return Result.ok(undefined);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      this.logger.error(`[SYNC] _transferOnce failed: ${msg}`);
      return Result.fail(new CommunicationError(msg));
    }
  }

  /**
   * @deprecated No longer used — kept for reference only.
   * Previously extracted device IP from baseUrl string; now we use HttpDeviceTransport.deviceIp directly.
   */
  private _extractIpFromTransport(transport: DeviceTransport): string | null {
    try {
      const baseUrl: string = (transport as unknown as { baseUrl: string }).baseUrl ?? "";
      const match = baseUrl.match(/http:\/\/([^:]+):/);
      return match?.[1] ?? null;
    } catch {
      return null;
    }
  }

  private _backoffDelay(attempt: number): number {
    const base = TRANSFER_RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1);
    const capped = Math.min(base, TRANSFER_RETRY_MAX_DELAY_MS);
    return Math.round(capped + Math.random() * 500);
  }

  private _sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private _emit(event: SyncEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (error) {
        this.logger.warn("[SYNC] Sync event listener threw an error", {
          error: String(error),
        });
      }
    }
  }
}
