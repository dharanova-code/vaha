import { DeviceCaptureMetadata } from "./DeviceStatus";

/**
 * Represents the transfer state of a single capture job in the local sync queue.
 * These are persisted to the sync_queue table in SQLite.
 */
export type CaptureTransferStatus =
  | "pending"
  | "downloading"
  | "verifying"
  | "storing"
  | "completed"
  | "failed";

/**
 * A single capture transfer job managed by DeviceSyncService.
 * Maps to a row in the sync_queue table and tracks the full lifecycle
 * of transferring one capture from the device to local storage.
 */
export interface CaptureTransferJob {
  /** Local sync_queue row ID */
  readonly syncQueueId: number;
  /** Device transaction ID — used as idempotency key */
  readonly transactionId: string;
  /** ID of the device row in the local devices table */
  readonly deviceId: number;
  /** Capture metadata returned by the device */
  readonly metadata: DeviceCaptureMetadata;
  /** Current transfer lifecycle state */
  readonly status: CaptureTransferStatus;
  /** Number of transfer attempts made so far */
  readonly attemptCount: number;
  /** Timestamp of the last attempt */
  readonly lastAttemptAt: Date | null;
  /** Error message if the last attempt failed */
  readonly lastError: string | null;
  /** Bytes downloaded so far (for resumable range requests) */
  readonly bytesDownloaded: number;
}

/**
 * Progress event emitted by DeviceSyncService during an active transfer.
 */
export interface TransferProgressEvent {
  readonly transactionId: string;
  readonly totalBytes: number;
  readonly downloadedBytes: number;
  readonly percentage: number;
  readonly status: CaptureTransferStatus;
}
