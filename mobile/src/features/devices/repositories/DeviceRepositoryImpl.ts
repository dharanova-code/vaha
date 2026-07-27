import { DeviceRepository } from "./DeviceRepository";
import { Database } from "@infra/database/config/Database";
import {
  devices,
  Device,
  NewDevice,
} from "@infra/database/schema/devices";
import { eq } from "drizzle-orm";
import { Result } from "@core/utils/Result";
import { DatabaseError } from "@core/errors/AppError";

export class DeviceRepositoryImpl implements DeviceRepository {
  private get db() {
    return Database.getInstance().getDb();
  }

  public async create(
    device: NewDevice,
  ): Promise<Result<Device, DatabaseError>> {
    try {
      const results = await this.db.insert(devices).values(device).returning();
      const inserted = results[0];
      if (!inserted) {
        return Result.fail(
          new DatabaseError("Failed to insert device record."),
        );
      }
      return Result.ok(inserted);
    } catch (error) {
      return Result.fail(
        new DatabaseError("Create device transaction failed", error),
      );
    }
  }

  public async update(
    id: number,
    device: Partial<NewDevice>,
  ): Promise<Result<Device, DatabaseError>> {
    try {
      const results = await this.db
        .update(devices)
        .set({ ...device, updatedAt: new Date() })
        .where(eq(devices.id, id))
        .returning();
      const updated = results[0];
      if (!updated) {
        return Result.fail(
          new DatabaseError(`Device with ID ${id} not found.`),
        );
      }
      return Result.ok(updated);
    } catch (error) {
      return Result.fail(
        new DatabaseError("Update device transaction failed", error),
      );
    }
  }

  public async findTrusted(): Promise<Result<Device[], DatabaseError>> {
    try {
      const matches = await this.db
        .select()
        .from(devices)
        .where(eq(devices.trusted, true));
      return Result.ok(matches);
    } catch (error) {
      return Result.fail(
        new DatabaseError("Query findTrusted devices failed", error),
      );
    }
  }

  public async findAll(): Promise<Result<Device[], DatabaseError>> {
    try {
      const all = await this.db.select().from(devices);
      return Result.ok(all);
    } catch (error) {
      return Result.fail(
        new DatabaseError("Query findAll devices failed", error),
      );
    }
  }

  public async findById(
    id: number,
  ): Promise<Result<Device | null, DatabaseError>> {
    try {
      const matches = await this.db
        .select()
        .from(devices)
        .where(eq(devices.id, id));
      return Result.ok(matches[0] ?? null);
    } catch (error) {
      return Result.fail(
        new DatabaseError(`Query findById device ${id} failed`, error),
      );
    }
  }

  public async setLastSeen(
    id: number,
    timestamp: Date,
  ): Promise<Result<void, DatabaseError>> {
    try {
      const results = await this.db
        .update(devices)
        .set({ lastSeen: timestamp, updatedAt: new Date() })
        .where(eq(devices.id, id))
        .returning();
      if (results.length === 0) {
        return Result.fail(
          new DatabaseError(`Device with ID ${id} not found.`),
        );
      }
      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        new DatabaseError(`Failed to update last seen for device ${id}`, error),
      );
    }
  }
}
