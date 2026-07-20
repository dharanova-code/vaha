import { Container } from "../di/Container";
import { appConfig } from "../config/AppConfig";
import { DatabaseProvider } from "@infra/database/config/DatabaseProvider";
import { Logger } from "../logger/Logger";

export type HealthStatus = "Healthy" | "Warning" | "Critical";

export interface HealthReport {
  status: HealthStatus;
  checks: {
    environment: boolean;
    logger: boolean;
    config: boolean;
    database: boolean;
    repositories: boolean;
    storage: boolean;
    filesystem: boolean;
  };
  details?: string[] | undefined;
}

export class StartupHealth {
  public static async verify(): Promise<HealthReport> {
    const details: string[] = [];
    const checks = {
      environment: false,
      logger: false,
      config: false,
      database: false,
      repositories: false,
      storage: true, // Local key-value storage availability
      filesystem: true, // Local file-system availability
    };

    const container = Container.getInstance();

    // 1. Environment check
    if (appConfig.env) {
      checks.environment = true;
    } else {
      details.push("Environment variable is undefined.");
    }

    // 2. Logger active check
    try {
      const logger = container.resolve<Logger>("Logger");
      if (logger && typeof logger.info === "function") {
        checks.logger = true;
      } else {
        details.push("Logger instance resolved but invalid.");
      }
    } catch (e) {
      details.push(`Logger check failed: ${e instanceof Error ? e.message : String(e)}`);
    }

    // 3. Configuration check
    if (appConfig.database?.name && appConfig.storage?.keystoreAlias) {
      checks.config = true;
    } else {
      details.push("Configuration parameters database.name or storage.keystoreAlias are missing.");
    }

    // 4. Database initialized check
    try {
      const dbProvider = container.resolve<DatabaseProvider>("DatabaseProvider");
      if (dbProvider) {
        const dbHealth = await dbProvider.health();
        if (dbHealth.isSuccess && dbHealth.getValueOrThrow().status === "healthy") {
          checks.database = true;
        } else {
          details.push("Database health check returned unhealthy.");
        }
      } else {
        details.push("DatabaseProvider not registered.");
      }
    } catch (e) {
      details.push(`DatabaseProvider check failed: ${e instanceof Error ? e.message : String(e)}`);
    }

    // 5. Repositories registered check
    const repos = [
      "CaptureRepository",
      "CollectionRepository",
      "TagRepository",
      "DeviceRepository",
      "SettingsRepository",
      "SyncRepository",
    ];
    let allReposRegistered = true;
    for (const repoToken of repos) {
      try {
        const repo = container.resolve(repoToken);
        if (!repo) {
          allReposRegistered = false;
          details.push(`Repository ${repoToken} resolved to null or undefined.`);
        }
      } catch {
        allReposRegistered = false;
        details.push(`Repository ${repoToken} is not registered in container.`);
      }
    }
    checks.repositories = allReposRegistered;

    // Determine status
    let status: HealthStatus = "Healthy";
    if (
      !checks.environment ||
      !checks.logger ||
      !checks.config ||
      !checks.database ||
      !checks.repositories
    ) {
      status = "Critical";
    }

    return {
      status,
      checks,
      details: details.length > 0 ? details : undefined,
    };
  }
}
