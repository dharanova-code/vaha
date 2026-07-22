import { useState, useEffect, useCallback } from "react";
import { Container } from "../../../core/di/Container";
import { CaptureRepository } from "../repositories/CaptureRepository";
import { CaptureWithTags, useCaptureStore } from "../../devices/stores/captureStore";
import { router } from "expo-router";

export function useCaptureDetailsData(uuid: string) {
  const [capture, setCapture] = useState<CaptureWithTags | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  
  const deleteCapture = useCaptureStore((state) => state.deleteCapture);
  const updateLocalCapture = useCaptureStore((state) => state.updateLocalCapture);

  const loadCapture = useCallback(async () => {
    if (!uuid) return;
    setIsLoading(true);
    setError(null);
    const repo = Container.getInstance().resolve<CaptureRepository>("CaptureRepository");
    const res = await repo.findByUuid(uuid);
    if (res.isSuccess) {
      const cap = res.getValueOrThrow();
      if (cap) {
        const tagsRes = await repo.getTagsForCapture(cap.id);
        const tagList = tagsRes.isSuccess ? tagsRes.getValueOrThrow() : [];
        setCapture({ ...cap, tags: tagList });
        setTags(tagList);
      } else {
        setCapture(null);
      }
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

  const handleUpdate = useCallback(async (fields: { title: string; transcript: string; tags: string[] }) => {
    if (capture) {
      await updateLocalCapture(capture.id, fields);
      await loadCapture();
    }
  }, [capture, updateLocalCapture, loadCapture]);

  return {
    capture,
    tags,
    isLoading,
    error,
    handleDelete,
    handleUpdate,
  };
}
