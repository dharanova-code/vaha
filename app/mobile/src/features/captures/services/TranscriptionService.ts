import { Result } from "../../../core/utils/Result";

export interface TranscriptionService {
  transcribe(audioUri: string): Promise<Result<string, Error>>;
}
