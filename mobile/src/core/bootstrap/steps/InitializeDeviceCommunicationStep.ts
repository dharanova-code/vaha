import { BootstrapStep } from "@core/bootstrap/BootstrapStep";
import { Result } from "@core/utils/Result";
import { AppError } from "@core/errors/AppError";
import { Container } from "@core/di/Container";
import { Logger } from "@core/logger/Logger";
import { DeviceDiscoveryService } from "@features/devices/services/DeviceDiscoveryService";
import { SyncService } from "@features/sync/services/SyncService";
import { DeviceTransportFactory } from "@features/devices/transport/DeviceTransportFactory";

/**
 * Bootstrap step that initialises the device communication layer.
 *
 * Registers the following singletons into the DI container:
 *
 * - "DeviceTransportFactory"   → DeviceTransportFactory
 * - "DeviceDiscoveryService"   → DeviceDiscoveryService
 * - "SyncService"              → SyncService
 *
 * This step runs after RegisterRepositoriesStep so that the
 * communication layer can inject repository dependencies when needed.
 *
 * @see ApplicationBootstrap — this step is registered after VerifyStartupStep
 */
export class InitializeDeviceCommunicationStep implements BootstrapStep {
  readonly name = "Initialize Device Communication";

  private transportFactory?: DeviceTransportFactory;
  private discoveryService?: DeviceDiscoveryService;
  private syncService?: SyncService;

  async initialize(): Promise<Result<void, AppError>> {
    try {
      const container = Container.getInstance();
      const logger = container.resolve<Logger>("Logger");

      this.transportFactory = new DeviceTransportFactory(logger);
      this.discoveryService = new DeviceDiscoveryService(
        logger,
        this.transportFactory,
      );
      this.syncService = new SyncService(logger);

      container.register("DeviceTransportFactory", this.transportFactory);
      container.register("DeviceDiscoveryService", this.discoveryService);
      container.register("SyncService", this.syncService);

      logger.info("[COMM] Device communication layer initialized");
      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        new AppError(
          "Failed to initialize device communication layer",
          "COMM_INIT_FAILED",
          error,
        ),
      );
    }
  }

  async health(): Promise<Result<void, AppError>> {
    if (!this.discoveryService || !this.syncService) {
      return Result.fail(
        new AppError(
          "Device communication services not initialized",
          "COMM_HEALTH_FAILED",
        ),
      );
    }
    return Result.ok(undefined);
  }

  async shutdown(): Promise<Result<void, AppError>> {
    // No persistent connections to tear down at this level —
    // active transports are managed per-session by DeviceDiscoveryService.
    return Result.ok(undefined);
  }
}
