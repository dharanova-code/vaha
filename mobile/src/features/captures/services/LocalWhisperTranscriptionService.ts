import { TranscriptionService } from "./TranscriptionService";
import { Result } from "../../../core/utils/Result";
import { Container } from "../../../core/di/Container";
import { Logger } from "../../../core/logger/Logger";
import { appConfig } from "../../../core/config/AppConfig";
import { useSettingsStore } from "../../settings/stores/settingsStore";
import * as FileSystem from "expo-file-system";

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
        this.logger.warn("[TRANSCRIPTION] UNO Q device offline. Attempting cloud fallback...");
        return await this.transcribeViaCloudFallback(audioUri);
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

  private async transcribeViaCloudFallback(audioUri: string): Promise<Result<string, Error>> {
    const groqKey = useSettingsStore.getState().groqApiKey;
    
    if (!groqKey) {
      this.logger.warn("[TRANSCRIPTION] No Groq API Key configured for fallback.");
      return Result.ok("Audio recorded locally (Offline). Configure a Groq API key in Settings to enable free internet transcription fallback.");
    }

    try {
      this.logger.info("[TRANSCRIPTION] Uploading to Groq Whisper API...");
      
      const formData = new FormData();
      formData.append("model", "whisper-large-v3");
      
      // Need to parse the URI for react-native fetch with FormData
      const filename = audioUri.split('/').pop() || 'recording.wav';
      
      formData.append("file", {
        uri: audioUri,
        name: filename,
        type: 'audio/wav'
      } as any);

      const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`[TRANSCRIPTION] Groq API Error: ${response.status} ${errorText}`);
        return Result.fail(new Error(`Cloud transcription failed: ${response.status}`));
      }

      const json = await response.json();
      return Result.ok(json.text);
    } catch (error) {
      this.logger.error("[TRANSCRIPTION] Cloud fallback failed", error);
      return Result.fail(error as Error);
    }
  }
}
