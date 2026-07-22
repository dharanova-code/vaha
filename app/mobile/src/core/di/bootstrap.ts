import { Container } from "./Container";
import { CaptureRepositoryImpl } from "@features/captures/repositories/CaptureRepositoryImpl";
import { CollectionRepositoryImpl } from "@features/collections/repositories/CollectionRepositoryImpl";
import { TagRepositoryImpl } from "@features/tags/repositories/TagRepositoryImpl";
import { DeviceRepositoryImpl } from "@features/devices/repositories/DeviceRepositoryImpl";
import { SettingsRepositoryImpl } from "@features/settings/repositories/SettingsRepositoryImpl";
import { SyncRepositoryImpl } from "@features/sync/repositories/SyncRepositoryImpl";
import { AudioRecordingService } from "@features/captures/services/AudioRecordingService";
import { Logger } from "../logger/Logger";

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
  
  container.singleton("AudioRecordingService", () => {
    const logger = container.resolve<Logger>("Logger");
    return new AudioRecordingService(logger);
  });

  container.singleton("TranscriptionService", () => {
    const logger = container.resolve<Logger>("Logger");
    const { LocalWhisperTranscriptionService } = require("@features/captures/services/LocalWhisperTranscriptionService");
    return new LocalWhisperTranscriptionService(logger);
  });
}
