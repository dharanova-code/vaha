import { Result } from "@core/utils/Result";
import { DatabaseError } from "@core/errors/AppError";
import { Capture, NewCapture } from "@infra/database/schema/captures";

export interface CaptureRepository {
  create(capture: NewCapture): Promise<Result<Capture, DatabaseError>>;
  update(
    id: number,
    capture: Partial<NewCapture>,
  ): Promise<Result<Capture, DatabaseError>>;
  delete(id: number): Promise<Result<void, DatabaseError>>;
  restore(id: number): Promise<Result<void, DatabaseError>>;
  softDelete(id: number): Promise<Result<void, DatabaseError>>;
  hardDelete(id: number): Promise<Result<void, DatabaseError>>;
  findById(id: number): Promise<Result<Capture | null, DatabaseError>>;
  findAll(): Promise<Result<Capture[], DatabaseError>>;
  findByCollection(
    collectionId: number,
  ): Promise<Result<Capture[], DatabaseError>>;
  findByDevice(deviceId: number): Promise<Result<Capture[], DatabaseError>>;
  count(): Promise<Result<number, DatabaseError>>;
  exists(id: number): Promise<Result<boolean, DatabaseError>>;
}
