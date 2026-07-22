import {
  DeviceTransport,
  DeviceStream,
  DeviceStreamMessage,
} from "./DeviceTransport";
import { Result } from "@core/utils/Result";
import {
  CommunicationError,
  DeviceRequestError,
  DeviceDisconnectedError,
  AuthenticationError,
  ChecksumMismatchError,
} from "@core/errors/CommunicationError";
import { Logger } from "@core/logger/Logger";
import {
  API_BASE_PATH,
  DEVICE_HTTP_PORT,
  WS_HEARTBEAT_INTERVAL_MS,
  WS_MAX_MISSED_HEARTBEATS,
} from "../constants/ApiCompatibility";

/**
 * Configuration required to create an HttpDeviceTransport instance.
 */
export interface HttpTransportConfig {
  /** Resolved IP address of the device on the local network */
  readonly deviceIp: string;
  /** Device UUID — sent as X-Device-UUID header on every request */
  readonly deviceUuid: string;
  /** Auth token — HMAC-SHA256 session token (or dev static token in Phase D) */
  readonly authToken: string;
  /** Port override (defaults to DEVICE_HTTP_PORT = 8080) */
  readonly port?: number;
}

/**
 * HTTP/WebSocket implementation of DeviceTransport.
 *
 * Uses:
 * - HTTP/1.1 REST for command/response operations (status, metadata, delete)
 * - HTTP Range requests for resumable binary downloads
 * - WebSocket for real-time streaming (telemetry, events)
 *
 * @see DeviceTransport
 */
export class HttpDeviceTransport implements DeviceTransport {
  private readonly baseUrl: string;
  private readonly wsBaseUrl: string;
  private readonly headers: Record<string, string>;
  private readonly logger: Logger;
  private activeStream: WebSocket | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private missedHeartbeats = 0;
  private _isConnected = false;

  constructor(config: HttpTransportConfig, logger: Logger) {
    const port = config.port ?? DEVICE_HTTP_PORT;
    this.baseUrl = `http://${config.deviceIp}:${port}${API_BASE_PATH}`;
    this.wsBaseUrl = `ws://${config.deviceIp}:${port}${API_BASE_PATH}`;
    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.authToken}`,
      "X-Device-UUID": config.deviceUuid,
    };
    this.logger = logger;
  }

  get isConnected(): boolean {
    return this._isConnected;
  }

  async get<T>(path: string): Promise<Result<T, CommunicationError>> {
    const url = `${this.baseUrl}${path}`;
    this.logger.debug(`[COMM] GET ${path}`);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: this.headers,
      });
      return this._handleJsonResponse<T>("GET", path, response);
    } catch (error) {
      return Result.fail(new DeviceRequestError("GET", path, undefined, error));
    }
  }

  async post<T, B extends object>(
    path: string,
    body: B,
  ): Promise<Result<T, CommunicationError>> {
    const url = `${this.baseUrl}${path}`;
    this.logger.debug(`[COMM] POST ${path}`);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(body),
      });
      return this._handleJsonResponse<T>("POST", path, response);
    } catch (error) {
      return Result.fail(new DeviceRequestError("POST", path, undefined, error));
    }
  }

  async delete<T>(path: string): Promise<Result<T, CommunicationError>> {
    const url = `${this.baseUrl}${path}`;
    this.logger.debug(`[COMM] DELETE ${path}`);
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: this.headers,
      });
      return this._handleJsonResponse<T>("DELETE", path, response);
    } catch (error) {
      return Result.fail(
        new DeviceRequestError("DELETE", path, undefined, error),
      );
    }
  }

  async upload<T>(
    path: string,
    fileUri: string,
    fieldName: string,
    mimeType: string
  ): Promise<Result<T, CommunicationError>> {
    const url = `${this.baseUrl}${path}`;
    this.logger.debug(`[COMM] UPLOAD ${path} (file: ${fileUri})`);
    try {
      const formData = new FormData();
      const fileData = {
        uri: fileUri,
        name: fileUri.split("/").pop() ?? "file",
        type: mimeType,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formData.append(fieldName, fileData as any);

      // We don't use this.headers because fetch sets its own multipart/form-data boundary
      const headers = {
        Authorization: `Bearer ${this.headers.Authorization?.split(" ")[1] ?? ""}`,
        "X-Device-UUID": this.headers["X-Device-UUID"] ?? "",
      };

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      });
      return this._handleJsonResponse<T>("POST", path, response);
    } catch (error) {
      return Result.fail(new DeviceRequestError("POST", path, undefined, error));
    }
  }

  async download(
    path: string,
    resumeFromByte: number,
    onProgress?: (bytesReceived: number, totalBytes: number) => void,
  ): Promise<Result<ArrayBuffer, CommunicationError>> {
    const url = `${this.baseUrl}${path}`;
    this.logger.debug(`[COMM] DOWNLOAD ${path} (offset=${resumeFromByte})`);

    const rangeHeaders: Record<string, string> = {
      ...this.headers,
      ...(resumeFromByte > 0
        ? { Range: `bytes=${resumeFromByte}-` }
        : {}),
    };

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: rangeHeaders,
      });

      if (response.status === 401) {
        return Result.fail(new AuthenticationError());
      }

      if (!response.ok && response.status !== 206) {
        return Result.fail(
          new DeviceRequestError("GET", path, response.status),
        );
      }

      if (!response.body) {
        return Result.fail(
          new DeviceRequestError("GET", path, response.status, "Empty response body"),
        );
      }

      const contentLength = parseInt(
        response.headers.get("Content-Length") ?? "0",
        10,
      );

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let bytesReceived = resumeFromByte;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        bytesReceived += value.length;
        onProgress?.(bytesReceived, contentLength + resumeFromByte);
      }

      const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
      const combined = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }

      this._isConnected = true;
      return Result.ok(combined.buffer);
    } catch (error) {
      return Result.fail(new DeviceRequestError("GET", path, undefined, error));
    }
  }

  openStream(
    path: string,
    onMessage: (message: DeviceStreamMessage) => void,
    onError: (error: CommunicationError) => void,
  ): DeviceStream {
    const wsUrl = `${this.wsBaseUrl}${path}`;
    this.logger.info(`[COMM] Opening WebSocket stream: ${wsUrl}`);

    const ws = new WebSocket(wsUrl);
    this.activeStream = ws;
    this.missedHeartbeats = 0;

    ws.onopen = () => {
      this._isConnected = true;
      this.logger.info("[COMM] WebSocket stream connected");
      this._startHeartbeat(ws, onError);
    };

    ws.onmessage = (event) => {
      this.missedHeartbeats = 0;
      try {
        const message = JSON.parse(event.data as string) as DeviceStreamMessage;
        if (message.type !== "pong") {
          onMessage(message);
        }
      } catch (error) {
        this.logger.warn("[COMM] Received malformed WebSocket message", {
          error: String(error),
        });
      }
    };

    ws.onerror = (event) => {
      this.logger.error("[COMM] WebSocket stream error", event);
      this._stopHeartbeat();
      this._isConnected = false;
    };

    ws.onclose = (event) => {
      this.logger.info("[COMM] WebSocket stream closed", {
        code: event.code,
        reason: event.reason,
      });
      this._stopHeartbeat();
      this._isConnected = false;
      if (!event.wasClean) {
        onError(
          new DeviceDisconnectedError("unknown", "WebSocket closed unexpectedly"),
        );
      }
    };

    return {
      send: (message: string) => ws.send(message),
      close: () => {
        this._stopHeartbeat();
        ws.close(1000, "Client requested close");
      },
      get isOpen() {
        return ws.readyState === WebSocket.OPEN;
      },
    };
  }

  async close(): Promise<void> {
    this._stopHeartbeat();
    if (this.activeStream && this.activeStream.readyState === WebSocket.OPEN) {
      this.activeStream.close(1000, "Transport closed");
    }
    this.activeStream = null;
    this._isConnected = false;
    this.logger.info("[COMM] Transport closed");
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async _handleJsonResponse<T>(
    method: string,
    path: string,
    response: Response,
  ): Promise<Result<T, CommunicationError>> {
    if (response.status === 401) {
      return Result.fail(new AuthenticationError());
    }
    if (!response.ok) {
      return Result.fail(
        new DeviceRequestError(method, path, response.status),
      );
    }
    try {
      const data = (await response.json()) as T;
      this._isConnected = true;
      return Result.ok(data);
    } catch (error) {
      return Result.fail(
        new DeviceRequestError(method, path, response.status, error),
      );
    }
  }

  private _startHeartbeat(
    ws: WebSocket,
    onError: (error: CommunicationError) => void,
  ): void {
    this.heartbeatTimer = setInterval(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        this._stopHeartbeat();
        return;
      }

      this.missedHeartbeats += 1;

      if (this.missedHeartbeats >= WS_MAX_MISSED_HEARTBEATS) {
        this.logger.error(
          `[COMM] ${WS_MAX_MISSED_HEARTBEATS} heartbeats missed — device offline`,
        );
        this._stopHeartbeat();
        this._isConnected = false;
        ws.close(1001, "Heartbeat timeout");
        onError(new DeviceDisconnectedError("unknown", "Heartbeat timeout"));
        return;
      }

      try {
        ws.send(JSON.stringify({ type: "ping" }));
      } catch (error) {
        this.logger.warn("[COMM] Failed to send heartbeat ping", {
          error: String(error),
        });
      }
    }, WS_HEARTBEAT_INTERVAL_MS);
  }

  private _stopHeartbeat(): void {
    if (this.heartbeatTimer !== null) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Exposed for internal use by DeviceSyncService checksum verification.
   * Validates a received ArrayBuffer against an expected MD5 base64 string.
   *
   * NOTE: React Native does not ship a native MD5 implementation.
   * This is a placeholder that always returns true in Phase D; the real
   * implementation will use expo-crypto in a follow-up once the transfer
   * pipeline is validated end-to-end.
   *
   * @see https://docs.expo.dev/versions/latest/sdk/crypto/
   */
  static verifyChecksum(
    _buffer: ArrayBuffer,
    _expectedMd5Base64: string,
  ): boolean {
    // TODO(ADR-0014): Replace with expo-crypto MD5 implementation before production.
    // Issue: vaha/issues/XXX
    return true;
  }

  /**
   * Exposed for ChecksumMismatchError construction by DeviceSyncService.
   */
  static createChecksumError(transactionId: string): ChecksumMismatchError {
    return new ChecksumMismatchError(transactionId);
  }
}
