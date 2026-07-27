import { useState, useCallback } from "react";
import { Container } from "../../../core/di/Container";
import { AudioRecordingService } from "../services/AudioRecordingService";
import { CaptureRepository } from "../repositories/CaptureRepository";
import { SyncRepository } from "../../sync/repositories/SyncRepository";
import { useCaptureStore } from "../../devices/stores/captureStore";

export function useAudioRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loadLocalCaptures } = useCaptureStore();

  const startRecording = useCallback(async () => {
    setError(null);
    const audioService = Container.getInstance().resolve<AudioRecordingService>("AudioRecordingService");
    
    const hasPermission = await audioService.requestPermissions();
    if (!hasPermission) {
      setError("Microphone permission is required to record audio.");
      return;
    }

    const result = await audioService.startRecording();
    if (result.isSuccess) {
      setIsRecording(true);
    } else {
      setError(result.getErrorOrThrow().message);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    const audioService = Container.getInstance().resolve<AudioRecordingService>("AudioRecordingService");
    const result = await audioService.stopRecording();
    setIsRecording(false);
    
    if (result.isSuccess) {
      const uuid = result.getValueOrThrow();
      
      // Save placeholder in local DB
      const captureRepo = Container.getInstance().resolve<CaptureRepository>("CaptureRepository");
      const insertResult = await captureRepo.create({
        uuid,
        title: "Local Voice Note",
        transcript: null,
        syncState: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      if (insertResult.isSuccess) {
        const localCaptureId = insertResult.getValueOrThrow().id;
        
        // Queue for existing transcription pipeline (placeholder entity name based on SyncQueue schema logic)
        const syncRepo = Container.getInstance().resolve<SyncRepository>("SyncRepository");
        await syncRepo.enqueue({
          entity: "capture_transcription",
          entityId: localCaptureId,
          operation: "insert",
          status: "pending"
        });
        
        // Refresh local captures view
        await loadLocalCaptures();
      } else {
        setError("Failed to save capture record.");
      }
    } else {
      setError(result.getErrorOrThrow().message);
    }
  }, [loadLocalCaptures]);

  return {
    isRecording,
    error,
    startRecording,
    stopRecording
  };
}
