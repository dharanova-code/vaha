import { TagRepository } from "./TagRepository";
import { Database } from "@infra/database/config/Database";
import {
  tags,
  captureTags,
  Tag,
  NewTag,
} from "@infra/database/schema/tags";
import { eq, and } from "drizzle-orm";
import { Result } from "@core/utils/Result";
import { DatabaseError } from "@core/errors/AppError";

export class TagRepositoryImpl implements TagRepository {
  private get db() {
    return Database.getInstance().getDb();
  }

  public async create(tag: NewTag): Promise<Result<Tag, DatabaseError>> {
    try {
      const results = await this.db.insert(tags).values(tag).returning();
      const inserted = results[0];
      if (!inserted) {
        return Result.fail(new DatabaseError("Failed to insert tag record."));
      }
      return Result.ok(inserted);
    } catch (error) {
      return Result.fail(
        new DatabaseError("Create tag transaction failed", error),
      );
    }
  }

  public async update(
    id: number,
    tag: Partial<NewTag>,
  ): Promise<Result<Tag, DatabaseError>> {
    try {
      const results = await this.db
        .update(tags)
        .set({ ...tag, updatedAt: new Date() })
        .where(eq(tags.id, id))
        .returning();
      const updated = results[0];
      if (!updated) {
        return Result.fail(new DatabaseError(`Tag with ID ${id} not found.`));
      }
      return Result.ok(updated);
    } catch (error) {
      return Result.fail(
        new DatabaseError("Update tag transaction failed", error),
      );
    }
  }

  public async delete(id: number): Promise<Result<void, DatabaseError>> {
    try {
      // cascade triggers will clean capture_tags junction
      const results = await this.db.delete(tags).where(eq(tags.id, id)).returning();
      if (results.length === 0) {
        return Result.fail(new DatabaseError(`Tag with ID ${id} not found.`));
      }
      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        new DatabaseError("Delete tag transaction failed", error),
      );
    }
  }

  public async findAll(): Promise<Result<Tag[], DatabaseError>> {
    try {
      const all = await this.db.select().from(tags);
      return Result.ok(all);
    } catch (error) {
      return Result.fail(new DatabaseError("Query findAll tags failed", error));
    }
  }

  public async attachToCapture(
    captureId: number,
    tagId: number,
  ): Promise<Result<void, DatabaseError>> {
    try {
      await this.db
        .insert(captureTags)
        .values({ captureId, tagId })
        .onConflictDoNothing();
      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        new DatabaseError(
          `Failed to link tag ${tagId} to capture ${captureId}`,
          error,
        ),
      );
    }
  }

  public async detachFromCapture(
    captureId: number,
    tagId: number,
  ): Promise<Result<void, DatabaseError>> {
    try {
      await this.db
        .delete(captureTags)
        .where(
          and(
            eq(captureTags.captureId, captureId),
            eq(captureTags.tagId, tagId),
          ),
        );
      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        new DatabaseError(
          `Failed to unlink tag ${tagId} from capture ${captureId}`,
          error,
        ),
      );
    }
  }

  public async findTagsForCapture(
    captureId: number,
  ): Promise<Result<Tag[], DatabaseError>> {
    try {
      const items = await this.db
        .select({
          id: tags.id,
          uuid: tags.uuid,
          name: tags.name,
          color: tags.color,
          createdAt: tags.createdAt,
          updatedAt: tags.updatedAt,
        })
        .from(captureTags)
        .innerJoin(tags, eq(captureTags.tagId, tags.id))
        .where(eq(captureTags.captureId, captureId));
      return Result.ok(items);
    } catch (error) {
      return Result.fail(
        new DatabaseError(
          `Failed to select tags linked to capture ${captureId}`,
          error,
        ),
      );
    }
  }
}
