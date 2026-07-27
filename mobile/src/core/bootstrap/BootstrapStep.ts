import { Result } from "../utils/Result";
import { AppError } from "../errors/AppError";

export interface BootstrapStep {
  readonly name: string;
  initialize(): Promise<Result<void, AppError>>;
  health(): Promise<Result<void, AppError>>;
  shutdown(): Promise<Result<void, AppError>>;
}
