import { AppError } from "../errors/AppError";

export interface BootstrapResult {
  readonly success: boolean;
  readonly durationMs: number;
  readonly stepsExecuted: string[];
  readonly error?: AppError;
}
