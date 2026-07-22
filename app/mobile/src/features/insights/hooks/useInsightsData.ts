import { useMemo } from "react";
import { useCaptureStore } from "../../devices/stores/captureStore";

export function useInsightsData() {
  const { captures, isLoading } = useCaptureStore();

  // Memoize aggregation to prevent recalculation on every render
  const { totalCaptures, totalDuration } = useMemo(() => {
    return {
      totalCaptures: captures.length,
      // For now, duration isn't natively on the capture, so we use a placeholder 60s
      totalDuration: captures.length * 60,
    };
  }, [captures]);

  const isEmpty = !isLoading && captures.length === 0;

  // Placeholder for future charts datasets
  const activityTrendData = useMemo(() => {
    // Return presentation-ready datasets instead of raw entities
    return [];
  }, []);

  return {
    isLoading,
    isEmpty,
    totalCaptures,
    totalDuration,
    activityTrendData,
  };
}
