import { SettingsRepository } from "./SettingsRepository";
import { Database } from "@infra/database/config/Database";
import { settings, Setting } from "@infra/database/schema/settings";
import { eq } from "drizzle-orm";
import { Result } from "@core/utils/Result";
import { DatabaseError } from "@core/errors/AppError";

export class SettingsRepositoryImpl implements SettingsRepository {
  private get db() {
    return Database.getInstance().getDb();
  }

  public async get(
    key: string,
  ): Promise<Result<Setting | null, DatabaseError>> {
    try {
      const matches = await this.db
        .select()
        .from(settings)
        .where(eq(settings.key, key));
      return Result.ok(matches[0] ?? null);
    } catch (error) {
      return Result.fail(
        new DatabaseError(`Query get setting ${key} failed`, error),
      );
    }
  }

  public async set(
    key: string,
    value: string,
  ): Promise<Result<Setting, DatabaseError>> {
    try {
      const results = await this.db
        .insert(settings)
        .values({ key, value, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: settings.key,
          set: { value, updatedAt: new Date() },
        })
        .returning();
      const updated = results[0];
      if (!updated) {
        return Result.fail(
          new DatabaseError(`Failed to save key-value setting ${key}.`),
        );
      }
      return Result.ok(updated);
    } catch (error) {
      return Result.fail(
        new DatabaseError(`Failed to set setting key ${key}`, error),
      );
    }
  }

  public async remove(key: string): Promise<Result<void, DatabaseError>> {
    try {
      const results = await this.db
        .delete(settings)
        .where(eq(settings.key, key))
        .returning();
      if (results.length === 0) {
        return Result.fail(
          new DatabaseError(`Setting with key ${key} not found.`),
        );
      }
      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        new DatabaseError(`Delete settings key ${key} failed`, error),
      );
    }
  }

  public async getAll(): Promise<Result<Setting[], DatabaseError>> {
    try {
      const all = await this.db.select().from(settings);
      return Result.ok(all);
    } catch (error) {
      return Result.fail(
        new DatabaseError("Query getAll settings failed", error),
      );
    }
  }
}
