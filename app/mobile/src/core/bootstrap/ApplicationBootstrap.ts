import { BootstrapManager } from "./BootstrapManager";
import { BootstrapStep } from "./BootstrapStep";
import { BootstrapResult } from "./BootstrapResult";
import { Result } from "../utils/Result";
import { AppError } from "../errors/AppError";
import { Container } from "../di/Container";
import { appConfig } from "../config/AppConfig";
import { ConsoleLogger, Logger } from "../logger/Logger";
import { DatabaseProvider } from "@infra/database/config/DatabaseProvider";
import { bootstrapDI } from "../di/bootstrap";
import { StartupHealth } from "../runtime/StartupHealth";
import { InitializeDeviceCommunicationStep } from "./steps/InitializeDeviceCommunicationStep";
import { SyncService } from "../../features/sync/services/SyncService";
import { DeviceTransportFactory } from "@features/devices/transport/DeviceTransportFactory";
import { SettingsRepository } from "@features/settings/repositories/SettingsRepository";
import { useSettingsStore } from "@features/settings/stores/settingsStore";
import { ExpoNetworkConnectivity } from "@platform/shared/connectivity/NetworkConnectivity";

export class LoadEnvironmentStep implements BootstrapStep {
  readonly name = "Load Environment";
  async initialize(): Promise<Result<void, AppError>> {
    if (appConfig.env) {
      return Result.ok(undefined);
    }
    return Result.fail(new AppError("Environment configuration failed to load", "ENV_LOAD_FAILED"));
  }
  async health(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
  async shutdown(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
}

export class InitializeLoggerStep implements BootstrapStep {
  readonly name = "Initialize Logger";
  async initialize(): Promise<Result<void, AppError>> {
    try {
      const container = Container.getInstance();
      const logger = new ConsoleLogger();
      container.register("Logger", logger);
      return Result.ok(undefined);
    } catch (e) {
      return Result.fail(new AppError("Failed to register logger", "LOGGER_INIT_FAILED", e));
    }
  }
  async health(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
  async shutdown(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
}

export class InitializeDIStep implements BootstrapStep {
  readonly name = "Initialize Dependency Injection";
  async initialize(): Promise<Result<void, AppError>> {
    try {
      const container = Container.getInstance();
      container.register("AppConfig", appConfig);
      
      const { ExpoStorage } = require("../../infrastructure/storage/KeyValueStorage");
      await ExpoStorage.loadAll();
      
      return Result.ok(undefined);
    } catch (e) {
      return Result.fail(new AppError("Failed to initialize DI configuration", "DI_INIT_FAILED", e));
    }
  }
  async health(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
  async shutdown(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
}

export class InitializeDatabaseStep implements BootstrapStep {
  readonly name = "Initialize Database";
  private dbProvider?: DatabaseProvider;
  async initialize(): Promise<Result<void, AppError>> {
    try {
      const container = Container.getInstance();
      const logger = container.resolve<Logger>("Logger");
      this.dbProvider = new DatabaseProvider(logger);
      const initResult = await this.dbProvider.initialize();
      if (!initResult.isSuccess) {
        return Result.fail(initResult.getErrorOrThrow());
      }
      container.register("DatabaseProvider", this.dbProvider);
      return Result.ok(undefined);
    } catch (e) {
      return Result.fail(new AppError("Failed to initialize database", "DB_INIT_FAILED", e));
    }
  }
  async health(): Promise<Result<void, AppError>> {
    if (!this.dbProvider) return Result.fail(new AppError("DB Provider not initialized", "DB_HEALTH_FAILED"));
    const h = await this.dbProvider.health();
    if (h.isSuccess && h.getValueOrThrow().status === "healthy") {
      return Result.ok(undefined);
    }
    return Result.fail(new AppError("Database is unhealthy", "DB_UNHEALTHY"));
  }
  async shutdown(): Promise<Result<void, AppError>> {
    if (this.dbProvider) {
      const res = await this.dbProvider.close();
      return res.isSuccess ? Result.ok(undefined) : Result.fail(res.getErrorOrThrow());
    }
    return Result.ok(undefined);
  }
}

export class RunMigrationsStep implements BootstrapStep {
  readonly name = "Run Database Migrations";
  async initialize(): Promise<Result<void, AppError>> {
    try {
      const container = Container.getInstance();
      const dbProvider = container.resolve<DatabaseProvider>("DatabaseProvider");
      const migResult = await dbProvider.runMigrations();
      if (!migResult.isSuccess) {
        return Result.fail(migResult.getErrorOrThrow());
      }
      return Result.ok(undefined);
    } catch (e) {
      return Result.fail(new AppError("Database migration failed", "DB_MIGRATION_FAILED", e));
    }
  }
  async health(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
  async shutdown(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
}

export class RegisterRepositoriesStep implements BootstrapStep {
  readonly name = "Register Repositories";
  async initialize(): Promise<Result<void, AppError>> {
    try {
      bootstrapDI();
      return Result.ok(undefined);
    } catch (e) {
      return Result.fail(new AppError("Repository registration failed", "REPO_REG_FAILED", e));
    }
  }
  async health(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
  async shutdown(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
}

export class VerifyRuntimeHealthStep implements BootstrapStep {
  readonly name = "Verify Runtime Health";
  async initialize(): Promise<Result<void, AppError>> {
    const report = await StartupHealth.verify();
    if (report.status === "Critical") {
      return Result.fail(new AppError(`Startup health validation critical: ${report.details?.join("; ")}`, "HEALTH_CRITICAL"));
    }
    return Result.ok(undefined);
  }
  async health(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
  async shutdown(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
}

export class InitializeSecureStorageStep implements BootstrapStep {
  readonly name = "Initialize Secure Storage";
  async initialize(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
  async health(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
  async shutdown(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
}

export class InitializeLocalStorageStep implements BootstrapStep {
  readonly name = "Load Settings (Local Storage)";
  async initialize(): Promise<Result<void, AppError>> {
    try {
      const container = Container.getInstance();
      // SettingsRepo was registered in RegisterRepositoriesStep
      const repo = container.resolve<SettingsRepository>("SettingsRepository");
      
      const serverIpRes = await repo.get("serverIp");
      const autoSyncRes = await repo.get("autoSync");

      if (serverIpRes.isSuccess && serverIpRes.getValueOrThrow()) {
        useSettingsStore.getState().setServerIp(serverIpRes.getValueOrThrow()!.value);
      }
      if (autoSyncRes.isSuccess && autoSyncRes.getValueOrThrow()) {
        useSettingsStore.getState().setAutoSync(autoSyncRes.getValueOrThrow()!.value === "true");
      }
      return Result.ok(undefined);
    } catch (e) {
      return Result.fail(new AppError("Failed to load settings from storage", "SETTINGS_LOAD_FAILED", e));
    }
  }
  async health(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
  async shutdown(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
}

export class InitializeFileSystemStep implements BootstrapStep {
  readonly name = "Initialize File System";
  async initialize(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
  async health(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
  async shutdown(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
}

export class InitializePlatformServicesStep implements BootstrapStep {
  readonly name = "Initialize Platform Services";
  async initialize(): Promise<Result<void, AppError>> {
    try {
      const container = Container.getInstance();
      const connectivity = new ExpoNetworkConnectivity();
      container.register("Connectivity", connectivity);
      return Result.ok(undefined);
    } catch (e) {
      return Result.fail(new AppError("Failed to init platform services", "PLATFORM_INIT_FAILED", e));
    }
  }
  async health(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
  async shutdown(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
}

export class VerifyStartupStep implements BootstrapStep {
  readonly name = "Verify Startup";
  async initialize(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
  async health(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
  async shutdown(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
}

export class RecoverSyncQueueStep implements BootstrapStep {
  readonly name = "Recover Sync Queue";
  async initialize(): Promise<Result<void, AppError>> {
    try {
      const container = Container.getInstance();
      const syncService = container.resolve<SyncService>("SyncService");
      const transportFactory = container.resolve<DeviceTransportFactory>("DeviceTransportFactory");
      const settingsRepo = container.resolve<SettingsRepository>("SettingsRepository");
      
      const serverIpRes = await settingsRepo.get("serverIp");
      const serverIp = serverIpRes.isSuccess && serverIpRes.getValueOrThrow() ? serverIpRes.getValueOrThrow()!.value : null;
      
      if (serverIp) {
        // Attempt to resume any pending downloads if we have an IP
        const transport = transportFactory.createHttpTransport({ deviceIp: serverIp, deviceUuid: "recovery" });
        // Fire and forget so we don't block bootstrap
        syncService.processQueue(transport).catch(() => {});
      }
      return Result.ok(undefined);
    } catch (_e) {
      // Don't fail bootstrap if this fails
      return Result.ok(undefined);
    }
  }
  async health(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
  async shutdown(): Promise<Result<void, AppError>> {
    return Result.ok(undefined);
  }
}

export class ApplicationBootstrap {
  private static instance: ApplicationBootstrap;
  private manager?: BootstrapManager;

  private constructor() {}

  public static getInstance(): ApplicationBootstrap {
    if (!ApplicationBootstrap.instance) {
      ApplicationBootstrap.instance = new ApplicationBootstrap();
    }
    return ApplicationBootstrap.instance;
  }

  public getManager(): BootstrapManager {
    if (!this.manager) {
      const logger = new ConsoleLogger();
      this.manager = new BootstrapManager(logger);
      
      // Register steps in order
      this.manager.register(new LoadEnvironmentStep());
      this.manager.register(new InitializeLoggerStep());
      this.manager.register(new InitializeDIStep());
      this.manager.register(new InitializeDatabaseStep());
      this.manager.register(new RunMigrationsStep());
      this.manager.register(new RegisterRepositoriesStep());
      this.manager.register(new VerifyRuntimeHealthStep());
      this.manager.register(new InitializeSecureStorageStep());
      this.manager.register(new InitializeLocalStorageStep());
      this.manager.register(new InitializeFileSystemStep());
      this.manager.register(new InitializePlatformServicesStep());
      this.manager.register(new VerifyStartupStep());
      this.manager.register(new InitializeDeviceCommunicationStep());
      this.manager.register(new RecoverSyncQueueStep());
    }
    return this.manager;
  }

  public async run(): Promise<BootstrapResult> {
    return this.getManager().bootstrap();
  }
}
