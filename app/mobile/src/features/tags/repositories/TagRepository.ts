import { Result } from "@core/utils/Result";
import { DatabaseError } from "@core/errors/AppError";
import { Tag, NewTag } from "@infra/database/schema/tags";

export interface TagRepository {
  create(tag: NewTag): Promise<Result<Tag, DatabaseError>>;
  update(id: number, tag: Partial<NewTag>): Promise<Result<Tag, DatabaseError>>;
  delete(id: number): Promise<Result<void, DatabaseError>>;
  findAll(): Promise<Result<Tag[], DatabaseError>>;
  attachToCapture(
    captureId: number,
    tagId: number,
  ): Promise<Result<void, DatabaseError>>;
  detachFromCapture(
    captureId: number,
    tagId: number,
  ): Promise<Result<void, DatabaseError>>;
  findTagsForCapture(captureId: number): Promise<Result<Tag[], DatabaseError>>;
}
