export interface Logger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(
    message: string,
    error?: Error | unknown,
    context?: Record<string, unknown>,
  ): void;
}

export class ConsoleLogger implements Logger {
  debug(message: string, context?: Record<string, unknown>): void {
    console.debug(
      `[DEBUG] ${message} ${context ? JSON.stringify(context) : ""}`,
    );
  }

  info(message: string, context?: Record<string, unknown>): void {
    console.info(`[INFO] ${message} ${context ? JSON.stringify(context) : ""}`);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(`[WARN] ${message} ${context ? JSON.stringify(context) : ""}`);
  }

  error(
    message: string,
    error?: Error | unknown,
    context?: Record<string, unknown>,
  ): void {
    console.error(
      `[ERROR] ${message}`,
      error,
      context ? JSON.stringify(context) : "",
    );
  }
}
