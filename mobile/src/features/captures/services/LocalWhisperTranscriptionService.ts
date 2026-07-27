import { TranscriptionService } from "./TranscriptionService";
import { Result } from "../../../core/utils/Result";
import { Container } from "../../../core/di/Container";
import { Logger } from "../../../core/logger/Logger";
import { appConfig } from "../../../core/config/AppConfig";

export class LocalWhisperTranscriptionService implements TranscriptionService {
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async transcribe(audioUri: string): Promise<Result<string, Error>> {
    try {
      this.logger.info(`[TRANSCRIPTION] Transcribing audio at URI: ${audioUri}`);
      const client = Container.getInstance().resolve<any>("DeviceClient");
      let transport = client.transport;
      
      if (!transport && appConfig.useMockDevice) {
        const factory = Container.getInstance().resolve<any>("DeviceTransportFactory");
        transport = factory.createHttpTransport({ deviceIp: "127.0.0.1", deviceUuid: "mock-temp" });
      }

      if (!transport) {
        return Result.fail(new Error("No active device or mock transport for local transcription"));
      }

      const res = await transport.upload("/captures/transcribe", audioUri, "audio", "audio/wav") as any;
      if (res.isSuccess) {
        const text = res.getValueOrThrow().transcript;
        return Result.ok(text);
      }
      return Result.fail(new Error("Transcription request failed on local edge node"));
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
