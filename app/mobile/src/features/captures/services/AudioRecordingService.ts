import { Audio } from "expo-av";
import * as FS from "expo-file-system";
import { Result } from "../../../core/utils/Result";
import { Logger } from "../../../core/logger/Logger";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, import/namespace
const FileSystem = FS as any;

export class AudioRecordingService {
  private recording: Audio.Recording | null = null;
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const response = await Audio.requestPermissionsAsync();
      return response.granted;
    } catch (error) {
      this.logger.error("Failed to request audio permissions", error as Error);
      return false;
    }
  }

  async startRecording(): Promise<Result<void, Error>> {
    try {
      if (this.recording) {
        return Result.fail(new Error("Already recording"));
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      this.recording = recording;
      this.logger.info("Started recording audio");
      return Result.ok(undefined);
    } catch (error) {
      this.logger.error("Failed to start recording", error as Error);
      return Result.fail(error as Error);
    }
  }

  async stopRecording(): Promise<Result<string, Error>> {
    try {
      if (!this.recording) {
        return Result.fail(new Error("Not recording"));
      }
      
      await this.recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = this.recording.getURI();
      this.recording = null;

      if (!uri) {
        return Result.fail(new Error("No recording URI returned"));
      }

      // Move to a permanent location
      const uuid = crypto.randomUUID();
      const audioDir = `${FileSystem.documentDirectory}vaha/audio/`;
      await FileSystem.makeDirectoryAsync(audioDir, { intermediates: true });
      
      const newUri = `${audioDir}${uuid}.wav`;
      await FileSystem.moveAsync({
        from: uri,
        to: newUri
      });
      
      this.logger.info(`Saved recording to ${newUri}`);
      
      // Return the UUID of the recording
      return Result.ok(uuid);
    } catch (error) {
      this.logger.error("Failed to stop recording", error as Error);
      return Result.fail(error as Error);
    }
  }
}
