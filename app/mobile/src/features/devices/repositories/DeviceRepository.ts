import { Result } from "@core/utils/Result";
import { DatabaseError } from "@core/errors/AppError";
import { Device, NewDevice } from "@infra/database/schema/devices";

export interface DeviceRepository {
  create(device: NewDevice): Promise<Result<Device, DatabaseError>>;
  update(
    id: number,
    device: Partial<NewDevice>,
  ): Promise<Result<Device, DatabaseError>>;
  findTrusted(): Promise<Result<Device[], DatabaseError>>;
  findAll(): Promise<Result<Device[], DatabaseError>>;
  findById(id: number): Promise<Result<Device | null, DatabaseError>>;
  setLastSeen(id: number, timestamp: Date): Promise<Result<void, DatabaseError>>;
}
