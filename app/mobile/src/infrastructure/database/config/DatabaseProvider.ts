import { Database } from "./Database";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import { Result } from "@core/utils/Result";
import { DatabaseError } from "@core/errors/AppError";
import { Logger } from "@core/logger/Logger";
import migrations from "../migrations/migrations";

export class DatabaseProvider {
  private readonly dbInstance = Database.getInstance();

  constructor(private readonly logger: Logger) {}

  public async initialize(): Promise<Result<void, DatabaseError>> {
    try {
      this.logger.info("Initializing SQLite database connection.");
      this.dbInstance.initialize();
      return Result.ok(undefined);
    } catch (error) {
      this.logger.error("Failed to initialize database connection", error);
      return Result.fail(
        new DatabaseError("Database connection initialization failed", error),
      );
    }
  }

  public async runMigrations(): Promise<Result<void, DatabaseError>> {
    try {
      this.logger.info("Executing database migrations.");
      const db = this.dbInstance.getDb();
      await migrate(db, migrations);
      this.logger.info("Database migrations executed successfully.");
      return Result.ok(undefined);
    } catch (error) {
      this.logger.error("Database migration execution failed", error);
      return Result.fail(
        new DatabaseError("Database migration execution failed", error),
      );
    }
  }

  public async health(): Promise<
    Result<
      { status: "healthy" | "unhealthy"; error?: string },
      DatabaseError
    >
  > {
    try {
      const expoDb = this.dbInstance.getExpoDb();
      expoDb.execSync("SELECT 1;");
      return Result.ok({ status: "healthy" });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error("Database health check failed", error);
      return Result.ok({ status: "unhealthy", error: msg });
    }
  }

  public async close(): Promise<Result<void, DatabaseError>> {
    try {
      this.logger.info("Closing database connection.");
      this.dbInstance.close();
      return Result.ok(undefined);
    } catch (error) {
      this.logger.error("Failed to close database connection", error);
      return Result.fail(
        new DatabaseError("Failed to close database connection", error),
      );
    }
  }

  public async transaction<T>(
    cb: (tx: any) => Promise<T>,
  ): Promise<Result<T, DatabaseError>> {
    try {
      const db = this.dbInstance.getDb();
      const result = await db.transaction(cb);
      return Result.ok(result);
    } catch (error) {
      this.logger.error("Database transaction failed", error);
      return Result.fail(new DatabaseError("Database transaction failed", error));
    }
  }
}
