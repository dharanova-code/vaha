import { AppError } from "./AppError";

/**
 * Base error for all device communication failures.
 */
export class CommunicationError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, "COMMUNICATION_ERROR", originalError);
  }
}

/**
 * Raised when the device cannot be found on the local network.
 */
export class DeviceNotFoundError extends CommunicationError {
  constructor(message = "Device not found on the local network") {
    super(message);
    this.name = "DeviceNotFoundError";
  }
}

/**
 * Raised when an established connection to the device is lost.
 */
export class DeviceDisconnectedError extends CommunicationError {
  constructor(deviceId: string, originalError?: unknown) {
    super(`Device ${deviceId} disconnected unexpectedly`, originalError);
    this.name = "DeviceDisconnectedError";
  }
}

/**
 * Raised when the device API version is incompatible with this app version.
 */
export class ApiVersionMismatchError extends CommunicationError {
  constructor(
    public readonly deviceVersion: string,
    public readonly minimumRequired: string,
  ) {
    super(
      `Device API version "${deviceVersion}" is below the minimum required "${minimumRequired}". Please update device firmware.`,
    );
    this.name = "ApiVersionMismatchError";
  }
}

/**
 * Raised when an HTTP request to the device fails.
 */
export class DeviceRequestError extends CommunicationError {
  constructor(
    public readonly method: string,
    public readonly path: string,
    public readonly statusCode?: number,
    originalError?: unknown,
  ) {
    super(
      `Device request failed: ${method} ${path}${statusCode !== undefined ? ` (HTTP ${statusCode})` : ""}`,
      originalError,
    );
    this.name = "DeviceRequestError";
  }
}

/**
 * Raised when a capture transfer fails checksum verification.
 */
export class ChecksumMismatchError extends CommunicationError {
  constructor(transactionId: string) {
    super(
      `Checksum mismatch for capture transfer "${transactionId}". Transfer discarded.`,
    );
    this.name = "ChecksumMismatchError";
  }
}

/**
 * Raised when the device authentication token is rejected.
 */
export class AuthenticationError extends CommunicationError {
  constructor(message = "Device authentication failed") {
    super(message);
    this.name = "AuthenticationError";
  }
}
