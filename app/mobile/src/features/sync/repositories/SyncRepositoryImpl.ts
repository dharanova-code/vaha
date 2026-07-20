import { SyncRepository } from "./SyncRepository";
import { Database } from "@infra/database/config/Database";
import {
  syncQueue,
  SyncQueueItem,
  NewSyncQueueItem,
} from "@infra/database/schema/sync";
import { eq } from "drizzle-orm";
import { Result } from "@core/utils/Result";
import { DatabaseError } from "@core/errors/AppError";

export class SyncRepositoryImpl implements SyncRepository {
  private get db() {
    return Database.getInstance().getDb();
  }

  public async enqueue(
    item: Omit<NewSyncQueueItem, "createdAt" | "updatedAt">,
  ): Promise<Result<SyncQueueItem, DatabaseError>> {
    try {
      const now = new Date();
      const results = await this.db
        .insert(syncQueue)
        .values({
          ...item,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      const inserted = results[0];
      if (!inserted) {
        return Result.fail(
          new DatabaseError("Failed to enqueue sync record."),
        );
      }
      return Result.ok(inserted);
    } catch (error) {
      return Result.fail(
        new DatabaseError("Enqueue sync item transaction failed", error),
      );
    }
  }

  public async markRunning(id: number): Promise<Result<void, DatabaseError>> {
    try {
      const results = await this.db
        .update(syncQueue)
        .set({ status: "processing", updatedAt: new Date() })
        .where(eq(syncQueue.id, id))
        .returning();
      if (results.length === 0) {
        return Result.fail(
          new DatabaseError(`Sync queue item ${id} not found.`),
        );
      }
      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        new DatabaseError(`Failed to mark sync item ${id} running`, error),
      );
    }
  }

  public async markCompleted(id: number): Promise<Result<void, DatabaseError>> {
    try {
      const results = await this.db
        .update(syncQueue)
        .set({ status: "completed", updatedAt: new Date() })
        .where(eq(syncQueue.id, id))
        .returning();
      if (results.length === 0) {
        return Result.fail(
          new DatabaseError(`Sync queue item ${id} not found.`),
        );
      }
      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        new DatabaseError(`Failed to mark sync item ${id} completed`, error),
      );
    }
  }

  public async markFailed(id: number): Promise<Result<void, DatabaseError>> {
    try {
      const results = await this.db
        .update(syncQueue)
        .set({ status: "failed", updatedAt: new Date() })
        .where(eq(syncQueue.id, id))
        .returning();
      if (results.length === 0) {
        return Result.fail(
          new DatabaseError(`Sync queue item ${id} not found.`),
        );
      }
      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        new DatabaseError(`Failed to mark sync item ${id} failed`, error),
      );
    }
  }

  public async pending(): Promise<Result<SyncQueueItem[], DatabaseError>> {
    try {
      const items = await this.db
        .select()
        .from(syncQueue)
        .where(eq(syncQueue.status, "pending"));
      return Result.ok(items);
    } catch (error) {
      return Result.fail(
        new DatabaseError("Query pending sync items failed", error),
      );
    }
  }

  public async clearCompleted(): Promise<Result<void, DatabaseError>> {
    try {
      await this.db.delete(syncQueue).where(eq(syncQueue.status, "completed"));
      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        new DatabaseError("Failed to clear completed sync items", error),
      );
    }
  }
}
