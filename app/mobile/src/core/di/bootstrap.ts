import { Container } from "./Container";
import { CaptureRepositoryImpl } from "@features/captures/repositories/CaptureRepositoryImpl";
import { CollectionRepositoryImpl } from "@features/collections/repositories/CollectionRepositoryImpl";
import { TagRepositoryImpl } from "@features/tags/repositories/TagRepositoryImpl";
import { DeviceRepositoryImpl } from "@features/devices/repositories/DeviceRepositoryImpl";
import { SettingsRepositoryImpl } from "@features/settings/repositories/SettingsRepositoryImpl";
import { SyncRepositoryImpl } from "@features/sync/repositories/SyncRepositoryImpl";

export function bootstrapDI(): void {
  const container = Container.getInstance();

  container.singleton("CaptureRepository", () => new CaptureRepositoryImpl());
  container.singleton(
    "CollectionRepository",
    () => new CollectionRepositoryImpl(),
  );
  container.singleton("TagRepository", () => new TagRepositoryImpl());
  container.singleton("DeviceRepository", () => new DeviceRepositoryImpl());
  container.singleton("SettingsRepository", () => new SettingsRepositoryImpl());
  container.singleton("SyncRepository", () => new SyncRepositoryImpl());
}
