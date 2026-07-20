export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string = "UNKNOWN_ERROR",
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, "DATABASE_ERROR", originalError);
  }
}

export class StorageError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, "STORAGE_ERROR", originalError);
  }
}

export class BLEError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, "BLE_ERROR", originalError);
  }
}

export class SyncError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, "SYNC_ERROR", originalError);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, "VALIDATION_ERROR", originalError);
  }
}

export class NetworkError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(message, "NETWORK_ERROR", originalError);
  }
}
