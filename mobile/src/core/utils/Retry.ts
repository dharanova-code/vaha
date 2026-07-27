import { Logger } from "../logger/Logger";

export interface RetryConfig {
  maxAttempts: number;
  backoffMs: number;
  shouldRetry?: (error: unknown) => boolean;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig,
  logger?: Logger,
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (
        attempt >= config.maxAttempts ||
        (config.shouldRetry && !config.shouldRetry(error))
      ) {
        throw error;
      }
      const delay = config.backoffMs * attempt;
      logger?.warn(
        `Retrying action (attempt ${attempt}/${config.maxAttempts}) in ${delay}ms`,
        { error },
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
