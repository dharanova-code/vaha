import { CaptureRepository } from "./CaptureRepository";
import { Database } from "@infra/database/config/Database";
import {
  captures,
  Capture,
  NewCapture,
} from "@infra/database/schema/captures";
import { eq, and, sql, or, like } from "drizzle-orm";
import { Result } from "@core/utils/Result";
import { DatabaseError } from "@core/errors/AppError";

export class CaptureRepositoryImpl implements CaptureRepository {
  private get db() {
    return Database.getInstance().getDb();
  }

  public async create(
    capture: NewCapture,
  ): Promise<Result<Capture, DatabaseError>> {
    try {
      const results = await this.db
        .insert(captures)
        .values(capture)
        .returning();
      const inserted = results[0];
      if (!inserted) {
        return Result.fail(
          new DatabaseError("Failed to insert capture record."),
        );
      }
      return Result.ok(inserted);
    } catch (error) {
      return Result.fail(
        new DatabaseError("Create capture transaction failed", error),
      );
    }
  }

  public async update(
    id: number,
    capture: Partial<NewCapture>,
  ): Promise<Result<Capture, DatabaseError>> {
    try {
      const results = await this.db
        .update(captures)
        .set({ ...capture, updatedAt: new Date() })
        .where(eq(captures.id, id))
        .returning();
      const updated = results[0];
      if (!updated) {
        return Result.fail(
          new DatabaseError(`Capture with ID ${id} not found.`),
        );
      }
      return Result.ok(updated);
    } catch (error) {
      return Result.fail(
        new DatabaseError("Update capture transaction failed", error),
      );
    }
  }

  public async delete(id: number): Promise<Result<void, DatabaseError>> {
    return this.softDelete(id);
  }

  public async softDelete(id: number): Promise<Result<void, DatabaseError>> {
    try {
      const results = await this.db
        .update(captures)
        .set({ deletedAt: new Date(), updatedAt: new Date() })
        .where(eq(captures.id, id))
        .returning();
      if (results.length === 0) {
        return Result.fail(
          new DatabaseError(`Capture with ID ${id} not found.`),
        );
      }
      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        new DatabaseError("Soft delete capture transaction failed", error),
      );
    }
  }

  public async hardDelete(id: number): Promise<Result<void, DatabaseError>> {
    try {
      const results = await this.db
        .delete(captures)
        .where(eq(captures.id, id))
        .returning();
      if (results.length === 0) {
        return Result.fail(
          new DatabaseError(`Capture with ID ${id} not found.`),
        );
      }
      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        new DatabaseError("Hard delete capture transaction failed", error),
      );
    }
  }

  public async restore(id: number): Promise<Result<void, DatabaseError>> {
    try {
      const results = await this.db
        .update(captures)
        .set({ deletedAt: null, updatedAt: new Date() })
        .where(eq(captures.id, id))
        .returning();
      if (results.length === 0) {
        return Result.fail(
          new DatabaseError(`Capture with ID ${id} not found.`),
        );
      }
      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        new DatabaseError("Restore capture transaction failed", error),
      );
    }
  }

  public async findById(
    id: number,
  ): Promise<Result<Capture | null, DatabaseError>> {
    try {
      const matches = await this.db
        .select()
        .from(captures)
        .where(eq(captures.id, id));
      return Result.ok(matches[0] ?? null);
    } catch (error) {
      return Result.fail(
        new DatabaseError(`Query findById capture ${id} failed`, error),
      );
    }
  }

  public async findByUuid(
    uuid: string,
  ): Promise<Result<Capture | null, DatabaseError>> {
    try {
      const matches = await this.db
        .select()
        .from(captures)
        .where(eq(captures.uuid, uuid));
      return Result.ok(matches[0] ?? null);
    } catch (error) {
      return Result.fail(
        new DatabaseError(`Query findByUuid capture ${uuid} failed`, error),
      );
    }
  }

  public async findAll(): Promise<Result<Capture[], DatabaseError>> {
    try {
      const all = await this.db
        .select()
        .from(captures)
        .where(sql`${captures.deletedAt} IS NULL`);
      return Result.ok(all);
    } catch (error) {
      return Result.fail(
        new DatabaseError("Query findAll captures failed", error),
      );
    }
  }

  public async findByCollection(
    collectionId: number,
  ): Promise<Result<Capture[], DatabaseError>> {
    try {
      const matches = await this.db
        .select()
        .from(captures)
        .where(
          and(
            eq(captures.collectionId, collectionId),
            sql`${captures.deletedAt} IS NULL`,
          ),
        );
      return Result.ok(matches);
    } catch (error) {
      return Result.fail(
        new DatabaseError(
          `Query findByCollection captures failed for collection ${collectionId}`,
          error,
        ),
      );
    }
  }

  public async findByDevice(
    deviceId: number,
  ): Promise<Result<Capture[], DatabaseError>> {
    try {
      const matches = await this.db
        .select()
        .from(captures)
        .where(
          and(
            eq(captures.deviceId, deviceId),
            sql`${captures.deletedAt} IS NULL`,
          ),
        );
      return Result.ok(matches);
    } catch (error) {
      return Result.fail(
        new DatabaseError(
          `Query findByDevice captures failed for device ${deviceId}`,
          error,
        ),
      );
    }
  }

  public async count(): Promise<Result<number, DatabaseError>> {
    try {
      const result = await this.db
        .select({ count: sql<number>`count(${captures.id})` })
        .from(captures)
        .where(sql`${captures.deletedAt} IS NULL`);
      return Result.ok(result[0]?.count ?? 0);
    } catch (error) {
      return Result.fail(
        new DatabaseError("Query count captures failed", error),
      );
    }
  }

  public async exists(id: number): Promise<Result<boolean, DatabaseError>> {
    try {
      const result = await this.db
        .select({ count: sql<number>`count(${captures.id})` })
        .from(captures)
        .where(eq(captures.id, id));
      const hasCount = (result[0]?.count ?? 0) > 0;
      return Result.ok(hasCount);
    } catch (error) {
      return Result.fail(
        new DatabaseError(`Query exists capture failed for ID ${id}`, error),
      );
    }
  }

  public async search(query: string): Promise<Result<Capture[], DatabaseError>> {
    try {
      const searchTerm = `%${query}%`;
      const matches = await this.db
        .select()
        .from(captures)
        .where(
          and(
            sql`${captures.deletedAt} IS NULL`,
            or(
              like(captures.title, searchTerm),
              like(captures.transcript, searchTerm)
            )
          )
        );
      return Result.ok(matches);
    } catch (error) {
      return Result.fail(
        new DatabaseError(`Query search captures failed for query "${query}"`, error),
      );
    }
  }

  public async getTagsForCapture(captureId: number): Promise<Result<string[], DatabaseError>> {
    try {
      const { tags: tagsTable, captureTags } = require("@infra/database/schema/tags");
      const results = await this.db
        .select({ name: tagsTable.name })
        .from(captureTags)
        .innerJoin(tagsTable, eq(captureTags.tagId, tagsTable.id))
        .where(eq(captureTags.captureId, captureId));
      return Result.ok(results.map((r: any) => r.name));
    } catch (error) {
      return Result.fail(new DatabaseError("Failed to fetch tags for capture", error));
    }
  }

  public async updateTagsForCapture(captureId: number, tagNames: string[]): Promise<Result<void, DatabaseError>> {
    try {
      const { tags: tagsTable, captureTags } = require("@infra/database/schema/tags");
      // 1. Delete existing connections
      await this.db.delete(captureTags).where(eq(captureTags.captureId, captureId));
      
      // 2. Insert tags if they don't exist and link them
      for (const name of tagNames) {
        const trimmed = name.trim();
        if (!trimmed) continue;
        
        let tagId: number;
        const existing = await this.db.select().from(tagsTable).where(eq(tagsTable.name, trimmed));
        if (existing.length > 0) {
          tagId = existing[0]!.id;
        } else {
          const newTag = await this.db.insert(tagsTable).values({
            uuid: crypto.randomUUID(),
            name: trimmed,
            createdAt: new Date(),
            updatedAt: new Date()
          }).returning();
          tagId = newTag[0]?.id || 0;
        }
        
        await this.db.insert(captureTags).values({
          captureId,
          tagId
        });
      }
      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(new DatabaseError("Failed to update tags for capture", error));
    }
  }

  public async getAllCaptureTags(): Promise<Result<Array<{ captureId: number; tagName: string }>, DatabaseError>> {
    try {
      const { tags: tagsTable, captureTags } = require("@infra/database/schema/tags");
      const results = await this.db
        .select({ captureId: captureTags.captureId, tagName: tagsTable.name })
        .from(captureTags)
        .innerJoin(tagsTable, eq(captureTags.tagId, tagsTable.id));
      return Result.ok(results);
    } catch (error) {
      return Result.fail(new DatabaseError("Failed to fetch all capture tags", error));
    }
  }
}
