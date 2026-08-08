import { useMemo } from "react";
import { useCaptureStore } from "../../devices/stores/captureStore";
import {
  generate45DaySensorData,
  generateHourlySensorData,
  calculateTelemetryInsights,
  DailySensorLog,
  HourlySensorLog,
  TelemetryInsights,
} from "../mock/mockSensorData";

export interface InsightsData {
  isLoading: boolean;
  isEmpty: boolean;
  totalCaptures: number;
  totalDuration: number;
  sensorLogs: DailySensorLog[];
  hourlyLogs: HourlySensorLog[];
  telemetryInsights: TelemetryInsights;
}

export function useInsightsData(): InsightsData {
  const { captures, isLoading } = useCaptureStore();

  // Load 45-day mock sensor logs
  const sensorLogs = useMemo(() => {
    return generate45DaySensorData();
  }, []);

  // Load 24 hourly mock sensor logs for "Today"
  const hourlyLogs = useMemo(() => {
    return generateHourlySensorData();
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
    hourlyLogs,
    telemetryInsights,
  };
}
