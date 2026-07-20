import { AppError } from "../errors/AppError";

export type AppStatus = "Initializing" | "Ready" | "Failed" | "Shutting Down";

export class RuntimeState {
  private static instance: RuntimeState;

  private status: AppStatus = "Initializing";
  private startupDurationMs = 0;
  private currentStep = "";
  private lastError: AppError | undefined = undefined;
  private readonly appVersion = "1.0.0";
  private environment: "development" | "production" | "test" = "development";

  private constructor() {}

  public static getInstance(): RuntimeState {
    if (!RuntimeState.instance) {
      RuntimeState.instance = new RuntimeState();
    }
    return RuntimeState.instance;
  }

  public getStatus(): AppStatus {
    return this.status;
  }

  public setStatus(status: AppStatus): void {
    this.status = status;
  }

  public getStartupDuration(): number {
    return this.startupDurationMs;
  }

  public setStartupDuration(duration: number): void {
    this.startupDurationMs = duration;
  }

  public getCurrentStep(): string {
    return this.currentStep;
  }

  public setCurrentStep(step: string): void {
    this.currentStep = step;
  }

  public getLastError(): AppError | undefined {
    return this.lastError;
  }

  public setLastError(error: AppError | undefined): void {
    this.lastError = error;
  }

  public getAppVersion(): string {
    return this.appVersion;
  }

  public getEnvironment(): "development" | "production" | "test" {
    return this.environment;
  }

  public setEnvironment(env: "development" | "production" | "test"): void {
    this.environment = env;
  }

  public reset(): void {
    this.status = "Initializing";
    this.startupDurationMs = 0;
    this.currentStep = "";
    this.lastError = undefined;
    this.environment = "development";
  }
}
