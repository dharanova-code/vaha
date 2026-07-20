import { Result } from "@core/utils/Result";
import { DatabaseError } from "@core/errors/AppError";
import { Setting } from "@infra/database/schema/settings";

export interface SettingsRepository {
  get(key: string): Promise<Result<Setting | null, DatabaseError>>;
  set(key: string, value: string): Promise<Result<Setting, DatabaseError>>;
  remove(key: string): Promise<Result<void, DatabaseError>>;
  getAll(): Promise<Result<Setting[], DatabaseError>>;
}
