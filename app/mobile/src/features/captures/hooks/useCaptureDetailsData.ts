import { useState, useEffect, useCallback } from "react";
import { Container } from "../../../core/di/Container";
import { CaptureRepository } from "../repositories/CaptureRepository";
import { Capture } from "../../../infrastructure/database/schema/captures";
import { useCaptureStore } from "../../devices/stores/captureStore";
import { router } from "expo-router";

export function useCaptureDetailsData(uuid: string) {
  const [capture, setCapture] = useState<Capture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const deleteCapture = useCaptureStore((state) => state.deleteCapture);

  const loadCapture = useCallback(async () => {
    if (!uuid) return;
    setIsLoading(true);
    setError(null);
    const repo = Container.getInstance().resolve<CaptureRepository>("CaptureRepository");
    const res = await repo.findByUuid(uuid);
    if (res.isSuccess) {
      setCapture(res.getValueOrThrow());
    } else {
      setError(res.getErrorOrThrow().message);
    }
    setIsLoading(false);
  }, [uuid]);

  useEffect(() => {
    loadCapture();
  }, [loadCapture]);

  const handleDelete = useCallback(async () => {
    if (capture) {
      await deleteCapture(capture.id);
      router.back();
    }
  }, [capture, deleteCapture]);

  return {
    capture,
    isLoading,
    error,
    handleDelete,
  };
}
