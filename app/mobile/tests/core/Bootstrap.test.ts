import { Container } from "@core/di/Container";
import { BootstrapManager } from "@core/bootstrap/BootstrapManager";
import { BootstrapStep } from "@core/bootstrap/BootstrapStep";
import { Result } from "@core/utils/Result";
import { AppError } from "@core/errors/AppError";
import { RuntimeState } from "@core/runtime/RuntimeState";
import { StartupHealth } from "@core/runtime/StartupHealth";
import { ConsoleLogger } from "@core/logger/Logger";

// A mock step implementation for testing BootstrapManager
class MockStep implements BootstrapStep {
  public initCalls = 0;
  public healthCalls = 0;
  public shutdownCalls = 0;

  constructor(
    public readonly name: string,
    private readonly shouldSucceed: boolean = true,
  ) {}

  public async initialize(): Promise<Result<void, AppError>> {
    this.initCalls++;
    if (this.shouldSucceed) {
      return Result.ok(undefined);
    }
    return Result.fail(new AppError(`${this.name} failed`, "MOCK_STEP_ERROR"));
  }

  public async health(): Promise<Result<void, AppError>> {
    this.healthCalls++;
    return Result.ok(undefined);
  }

  public async shutdown(): Promise<Result<void, AppError>> {
    this.shutdownCalls++;
    return Result.ok(undefined);
  }
}

describe("Bootstrap & Runtime Lifecycle", () => {
  let logger: ConsoleLogger;
  let manager: BootstrapManager;
  let container: Container;

  beforeEach(() => {
    logger = new ConsoleLogger();
    manager = new BootstrapManager(logger);
    container = Container.getInstance();
    container.clear();
    RuntimeState.getInstance().reset();
  });

  describe("BootstrapManager", () => {
    it("should run registered steps in correct sequential order", async () => {
      const step1 = new MockStep("Step 1");
      const step2 = new MockStep("Step 2");
      const order: string[] = [];

      const originalInit1 = step1.initialize.bind(step1);
      step1.initialize = async () => {
        order.push("step1");
        return originalInit1();
      };

      const originalInit2 = step2.initialize.bind(step2);
      step2.initialize = async () => {
        order.push("step2");
        return originalInit2();
      };

      manager.register(step1);
      manager.register(step2);

      const result = await manager.bootstrap();

      expect(result.success).toBe(true);
      expect(result.stepsExecuted).toEqual(["Step 1", "Step 2"]);
      expect(step1.initCalls).toBe(1);
      expect(step2.initCalls).toBe(1);
      expect(order).toEqual(["step1", "step2"]);
      expect(RuntimeState.getInstance().getStatus()).toBe("Ready");
    });

    it("should stop execution immediately and fail if a step fails", async () => {
      const step1 = new MockStep("Step 1");
      const step2 = new MockStep("Step 2", false); // will fail
      const step3 = new MockStep("Step 3");

      manager.register(step1);
      manager.register(step2);
      manager.register(step3);

      const result = await manager.bootstrap();

      expect(result.success).toBe(false);
      expect(result.stepsExecuted).toEqual(["Step 1", "Step 2"]);
      expect(step1.initCalls).toBe(1);
      expect(step2.initCalls).toBe(1);
      expect(step3.initCalls).toBe(0); // should not be executed
      expect(RuntimeState.getInstance().getStatus()).toBe("Failed");
      expect(RuntimeState.getInstance().getLastError()?.message).toContain("Step 2 failed");
    });

    it("should shut down registered steps in reverse sequence order", async () => {
      const step1 = new MockStep("Step 1");
      const step2 = new MockStep("Step 2");
      const shutdownOrder: string[] = [];

      step1.shutdown = async () => {
        shutdownOrder.push("step1");
        return Result.ok(undefined);
      };
      step2.shutdown = async () => {
        shutdownOrder.push("step2");
        return Result.ok(undefined);
      };

      manager.register(step1);
      manager.register(step2);

      await manager.shutdown();

      expect(shutdownOrder).toEqual(["step2", "step1"]);
      expect(RuntimeState.getInstance().getStatus()).toBe("Shutting Down");
    });
  });

  describe("StartupHealth Checker", () => {
    it("should report Critical status if dependencies are missing", async () => {
      // Container is empty, so dependencies (Logger, DatabaseProvider, repositories) are missing.
      const healthReport = await StartupHealth.verify();
      expect(healthReport.status).toBe("Critical");
      expect(healthReport.checks.environment).toBe(true); // appConfig has defaults
      expect(healthReport.checks.logger).toBe(false);
      expect(healthReport.checks.database).toBe(false);
      expect(healthReport.checks.repositories).toBe(false);
    });

    it("should report Healthy status if all components are initialized and registered", async () => {
      // Mock Logger
      container.register("Logger", logger);

      // Mock DatabaseProvider
      const mockDbProvider = {
        health: jest.fn(() => Promise.resolve(Result.ok({ status: "healthy" }))),
      };
      container.register("DatabaseProvider", mockDbProvider);

      // Mock Repositories
      const mockRepo = {};
      container.register("CaptureRepository", mockRepo);
      container.register("CollectionRepository", mockRepo);
      container.register("TagRepository", mockRepo);
      container.register("DeviceRepository", mockRepo);
      container.register("SettingsRepository", mockRepo);
      container.register("SyncRepository", mockRepo);

      const healthReport = await StartupHealth.verify();
      expect(healthReport.status).toBe("Healthy");
      expect(healthReport.checks.environment).toBe(true);
      expect(healthReport.checks.logger).toBe(true);
      expect(healthReport.checks.database).toBe(true);
      expect(healthReport.checks.repositories).toBe(true);
    });
  });
});
