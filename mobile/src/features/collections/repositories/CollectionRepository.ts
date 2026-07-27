import { Result } from "@core/utils/Result";
import { DatabaseError } from "@core/errors/AppError";
import {
  Collection,
  NewCollection,
} from "@infra/database/schema/collections";

export interface CollectionRepository {
  create(collection: NewCollection): Promise<Result<Collection, DatabaseError>>;
  update(
    id: number,
    collection: Partial<NewCollection>,
  ): Promise<Result<Collection, DatabaseError>>;
  delete(id: number): Promise<Result<void, DatabaseError>>;
  findAll(): Promise<Result<Collection[], DatabaseError>>;
  findById(id: number): Promise<Result<Collection | null, DatabaseError>>;
  count(): Promise<Result<number, DatabaseError>>;
}
