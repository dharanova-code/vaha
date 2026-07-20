import { BootstrapStep } from "./BootstrapStep";
import { BootstrapResult } from "./BootstrapResult";
import { Logger } from "../logger/Logger";
import { AppError } from "../errors/AppError";
import { RuntimeState } from "../runtime/RuntimeState";

export class BootstrapManager {
  private readonly steps: BootstrapStep[] = [];

  constructor(private readonly logger: Logger) {}

  public register(step: BootstrapStep): void {
    this.steps.push(step);
    this.logger.debug(`Registered bootstrap step: ${step.name}`);
  }

  public async bootstrap(): Promise<BootstrapResult> {
    const state = RuntimeState.getInstance();
    state.setStatus("Initializing");
    const startTime = Date.now();
    const executedSteps: string[] = [];

    this.logger.info("Starting application bootstrap pipeline...");

    for (const step of this.steps) {
      state.setCurrentStep(step.name);
      this.logger.info(`Running bootstrap step: ${step.name}`);
      executedSteps.push(step.name);

      try {
        const result = await step.initialize();
        if (!result.isSuccess) {
          const err = result.getErrorOrThrow();
          const duration = Date.now() - startTime;
          state.setStatus("Failed");
          state.setLastError(err);
          state.setStartupDuration(duration);
          this.logger.error(`Bootstrap step failed: ${step.name}`, err);
          return {
            success: false,
            durationMs: duration,
            stepsExecuted: executedSteps,
            error: err,
          };
        }
      } catch (error) {
        const err = new AppError(
          `Unhandled exception in step: ${step.name}`,
          "BOOTSTRAP_STEP_EXCEPTION",
          error,
        );
        const duration = Date.now() - startTime;
        state.setStatus("Failed");
        state.setLastError(err);
        state.setStartupDuration(duration);
        this.logger.error(`Bootstrap step threw unhandled exception: ${step.name}`, error);
        return {
          success: false,
          durationMs: duration,
          stepsExecuted: executedSteps,
          error: err,
        };
      }
    }

    const totalDuration = Date.now() - startTime;
    state.setStatus("Ready");
    state.setStartupDuration(totalDuration);
    this.logger.info(`Application bootstrap completed successfully in ${totalDuration}ms`);

    return {
      success: true,
      durationMs: totalDuration,
      stepsExecuted: executedSteps,
    };
  }

  public async shutdown(): Promise<void> {
    const state = RuntimeState.getInstance();
    state.setStatus("Shutting Down");
    this.logger.info("Starting application shutdown pipeline...");

    for (let i = this.steps.length - 1; i >= 0; i--) {
      const step = this.steps[i]!;
      this.logger.info(`Shutting down bootstrap step: ${step.name}`);
      try {
        await step.shutdown();
      } catch (error) {
        this.logger.error(`Error shutting down step ${step.name}`, error);
      }
    }

    this.logger.info("Application shutdown completed.");
  }
}
