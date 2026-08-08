import { useMemo } from "react";
import { useCaptureStore } from "../../devices/stores/captureStore";
import {
  generate45DaySensorData,
  calculateTelemetryInsights,
  DailySensorLog,
  TelemetryInsights,
} from "../mock/mockSensorData";

export interface InsightsData {
  isLoading: boolean;
  isEmpty: boolean;
  totalCaptures: number;
  totalDuration: number;
  sensorLogs: DailySensorLog[];
  telemetryInsights: TelemetryInsights;
}

export function useInsightsData(): InsightsData {
  const { captures, isLoading } = useCaptureStore();

  // Load 45-day mock sensor logs
  const sensorLogs = useMemo(() => {
    return generate45DaySensorData();
  }, []);

  // Calculate telemetry insights
  const telemetryInsights = useMemo(() => {
    return calculateTelemetryInsights(sensorLogs);
  }, [sensorLogs]);

  // Aggregate captures info
  const { totalCaptures, totalDuration } = useMemo(() => {
    return {
      totalCaptures: captures.length,
      totalDuration: captures.length * 45, // assume average of 45s per note
    };
  }, [captures]);

  // The screen is never empty now because we always show telemetry logs & sustainability insights
  const isEmpty = false;

  return {
    isLoading,
    isEmpty,
    totalCaptures,
    totalDuration,
    sensorLogs,
    telemetryInsights,
  };
}
