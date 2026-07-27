import { CollectionRepository } from "./CollectionRepository";
import { Database } from "@infra/database/config/Database";
import {
  collections,
  Collection,
  NewCollection,
} from "@infra/database/schema/collections";
import { eq, sql } from "drizzle-orm";
import { Result } from "@core/utils/Result";
import { DatabaseError } from "@core/errors/AppError";

export class CollectionRepositoryImpl implements CollectionRepository {
  private get db() {
    return Database.getInstance().getDb();
  }

  public async create(
    collection: NewCollection,
  ): Promise<Result<Collection, DatabaseError>> {
    try {
      const results = await this.db
        .insert(collections)
        .values(collection)
        .returning();
      const inserted = results[0];
      if (!inserted) {
        return Result.fail(
          new DatabaseError("Failed to insert collection record."),
        );
      }
      return Result.ok(inserted);
    } catch (error) {
      return Result.fail(
        new DatabaseError("Create collection transaction failed", error),
      );
    }
  }

  public async update(
    id: number,
    collection: Partial<NewCollection>,
  ): Promise<Result<Collection, DatabaseError>> {
    try {
      const results = await this.db
        .update(collections)
        .set({ ...collection, updatedAt: new Date() })
        .where(eq(collections.id, id))
        .returning();
      const updated = results[0];
      if (!updated) {
        return Result.fail(
          new DatabaseError(`Collection with ID ${id} not found.`),
        );
      }
      return Result.ok(updated);
    } catch (error) {
      return Result.fail(
        new DatabaseError("Update collection transaction failed", error),
      );
    }
  }

  public async delete(id: number): Promise<Result<void, DatabaseError>> {
    try {
      const results = await this.db
        .update(collections)
        .set({ deletedAt: new Date(), updatedAt: new Date() })
        .where(eq(collections.id, id))
        .returning();
      if (results.length === 0) {
        return Result.fail(
          new DatabaseError(`Collection with ID ${id} not found.`),
        );
      }
      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        new DatabaseError("Delete collection transaction failed", error),
      );
    }
  }

  public async findAll(): Promise<Result<Collection[], DatabaseError>> {
    try {
      const items = await this.db
        .select()
        .from(collections)
        .where(sql`${collections.deletedAt} IS NULL`);
      return Result.ok(items);
    } catch (error) {
      return Result.fail(
        new DatabaseError("Query findAll collections failed", error),
      );
    }
  }

  public async findById(
    id: number,
  ): Promise<Result<Collection | null, DatabaseError>> {
    try {
      const items = await this.db
        .select()
        .from(collections)
        .where(eq(collections.id, id));
      const match = items[0] ?? null;
      return Result.ok(match);
    } catch (error) {
      return Result.fail(
        new DatabaseError(`Query findById collection ${id} failed`, error),
      );
    }
  }

  public async count(): Promise<Result<number, DatabaseError>> {
    try {
      const result = await this.db
        .select({ count: sql<number>`count(${collections.id})` })
        .from(collections)
        .where(sql`${collections.deletedAt} IS NULL`);
      return Result.ok(result[0]?.count ?? 0);
    } catch (error) {
      return Result.fail(
        new DatabaseError("Query count collections failed", error),
      );
    }
  }
}
