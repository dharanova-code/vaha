import { Result } from "@core/utils/Result";
import { DatabaseError } from "@core/errors/AppError";
import {
  SyncQueueItem,
  NewSyncQueueItem,
} from "@infra/database/schema/sync";

export interface SyncRepository {
  enqueue(
    item: Omit<NewSyncQueueItem, "createdAt" | "updatedAt">,
  ): Promise<Result<SyncQueueItem, DatabaseError>>;
  markRunning(id: number): Promise<Result<void, DatabaseError>>;
  markCompleted(id: number): Promise<Result<void, DatabaseError>>;
  markFailed(id: number): Promise<Result<void, DatabaseError>>;
  pending(): Promise<Result<SyncQueueItem[], DatabaseError>>;
  clearCompleted(): Promise<Result<void, DatabaseError>>;
}
