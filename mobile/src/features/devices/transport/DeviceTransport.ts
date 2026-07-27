import { Result } from "@core/utils/Result";
import { CommunicationError } from "@core/errors/CommunicationError";

/**
 * Abstract transport interface for all device communication.
 *
 * Implementations may use HTTP/WebSocket (Wi-Fi) or BLE.
 * All business logic in DeviceDiscoveryService and DeviceSyncService
 * depends on this interface — never on a concrete implementation.
 */
export interface DeviceTransport {
  /**
   * Perform a GET request to the device.
   * @param path - Path relative to the API base URL (e.g. "/status")
   */
  get<T>(path: string): Promise<Result<T, CommunicationError>>;

  /**
   * Perform a POST request to the device.
   * @param path - Path relative to the API base URL
   * @param body - Request body (will be serialized as JSON)
   */
  post<T, B extends object>(
    path: string,
    body: B,
  ): Promise<Result<T, CommunicationError>>;

  /**
   * Perform a DELETE request to the device.
   * @param path - Path relative to the API base URL
   */
  delete<T>(path: string): Promise<Result<T, CommunicationError>>;

  /**
   * Upload a file to the device using multipart/form-data.
   * @param path - Path relative to the API base URL
   * @param fileUri - Local file URI to upload
   * @param fieldName - Form field name for the file
   * @param mimeType - MIME type of the file
   */
  upload<T>(
    path: string,
    fileUri: string,
    fieldName: string,
    mimeType: string
  ): Promise<Result<T, CommunicationError>>;

  /**
   * Download a binary payload (e.g. audio file) from the device.
   * Supports resumable downloads via HTTP Range headers.
   *
   * @param path - Path relative to the API base URL
   * @param resumeFromByte - Byte offset to resume from (0 for fresh download)
   * @param onProgress - Optional callback for download progress
   * @returns ArrayBuffer of the downloaded bytes
   */
  download(
    path: string,
    resumeFromByte: number,
    onProgress?: (bytesReceived: number, totalBytes: number) => void,
  ): Promise<Result<ArrayBuffer, CommunicationError>>;

  /**
   * Open a persistent WebSocket stream to the device.
   *
   * @param path - WebSocket endpoint path (e.g. "/ws")
   * @param onMessage - Callback invoked for each message received
   * @param onError - Callback invoked on stream error
   * @returns DeviceStream handle — call .close() to terminate
   */
  openStream(
    path: string,
    onMessage: (message: DeviceStreamMessage) => void,
    onError: (error: CommunicationError) => void,
  ): DeviceStream;

  /**
   * Gracefully close all active connections (HTTP keep-alive + WebSocket).
   */
  close(): Promise<void>;

  /** Whether the transport currently has an active connection. */
  readonly isConnected: boolean;
}

/**
 * A live WebSocket stream handle returned by DeviceTransport.openStream().
 */
export interface DeviceStream {
  /** Send a raw text message to the device over the stream. */
  send(message: string): void;
  /** Close the stream gracefully. */
  close(): void;
  /** Whether the stream is currently open. */
  readonly isOpen: boolean;
}

/**
 * A message received over the WebSocket stream from the device.
 */
export interface DeviceStreamMessage {
  readonly type: "telemetry" | "capture_ready" | "pong" | "error" | "status";
  readonly payload: unknown;
  readonly timestamp: string;
}
