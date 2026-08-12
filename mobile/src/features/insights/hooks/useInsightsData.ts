import { useMemo, useState, useEffect } from "react";
import { useCaptureStore } from "../../devices/stores/captureStore";
import { useDeviceStore } from "../../devices/stores/deviceStore";
import { Database } from "@infra/database/config/Database";
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
  const { liveSensors } = useDeviceStore();
  
  const [dailyAggs, setDailyAggs] = useState<any[]>([]);
  const [hourlyAggs, setHourlyAggs] = useState<any[]>([]);

  // Load aggregated logs from SQLite database on mount or when live sensors are updated
  useEffect(() => {
    try {
      const expoDb = Database.getInstance().getExpoDb();
      
      // 1. Fetch daily aggregates
      const dailyRows = expoDb.getAllSync<any>(`
        SELECT 
          date(timestamp / 1000, 'unixepoch', 'localtime') as dayDate,
          avg(temperature) as avg_temp,
          avg(humidity) as avg_hum,
          avg(voc) as avg_voc,
          sum(flow_rate) as total_flow_rate,
          max(accumulated_volume) as max_vol,
          min(accumulated_volume) as min_vol
        FROM sensor_logs
        GROUP BY dayDate
        ORDER BY dayDate ASC;
      `);
      setDailyAggs(dailyRows || []);

      // 2. Fetch hourly aggregates for today
      const hourlyRows = expoDb.getAllSync<any>(`
        SELECT 
          cast(strftime('%H', timestamp / 1000, 'unixepoch', 'localtime') as integer) as hourVal,
          avg(temperature) as avg_temp,
          avg(humidity) as avg_hum,
          avg(voc) as avg_voc,
          sum(flow_rate) as total_flow_rate,
          max(accumulated_volume) as max_vol,
          min(accumulated_volume) as min_vol
        FROM sensor_logs
        WHERE date(timestamp / 1000, 'unixepoch', 'localtime') = date('now', 'localtime')
        GROUP BY hourVal
        ORDER BY hourVal ASC;
      `);
      setHourlyAggs(hourlyRows || []);
    } catch (err) {
      console.warn("[useInsightsData] Failed to load aggregated sensor logs from SQLite", err);
    }
  }, [liveSensors]);

  // Merge real SQLite daily aggregates into 45-day daily logs
  const sensorLogs = useMemo(() => {
    const mockLogs = generate45DaySensorData();
    if (dailyAggs.length === 0) return mockLogs;

    return mockLogs.map((mockLog) => {
      // Find matching date row
      const match = dailyAggs.find((row) => {
        try {
          const dateObj = new Date(row.dayDate + "T00:00:00");
          const rowLabel = dateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
          });
          return rowLabel === mockLog.date;
        } catch {
          return false;
        }
      });

      if (!match) return mockLog;

      const averageTemperature = match.avg_temp != null ? Math.round(match.avg_temp * 10) / 10 : mockLog.averageTemperature;
      const averageHumidity = match.avg_hum != null ? Math.round(match.avg_hum) : mockLog.averageHumidity;
      const averageTVOC = match.avg_voc != null ? Math.round(match.avg_voc) : mockLog.averageTVOC;

      const waterFromFlow = match.total_flow_rate != null ? match.total_flow_rate / 6 : 0;
      const waterFromVolume = (match.max_vol != null && match.min_vol != null) ? (match.max_vol - match.min_vol) : 0;
      const waterConsumedLiters = Math.round(Math.max(waterFromFlow, waterFromVolume) * 10) / 10;

      const isAnomaly = waterConsumedLiters > 150;
      const anomalyReason = isAnomaly ? "High water consumption detected" : "";

      return {
        date: mockLog.date,
        waterConsumedLiters: waterConsumedLiters || mockLog.waterConsumedLiters,
        averageTemperature,
        averageHumidity,
        averageTVOC,
        isAnomaly: isAnomaly || mockLog.isAnomaly,
        anomalyReason: anomalyReason || mockLog.anomalyReason,
      };
    });
  }, [dailyAggs]);

  // Merge real SQLite hourly aggregates into 24-hour hourly logs
  const hourlyLogs = useMemo(() => {
    const mockHourly = generateHourlySensorData();
    const currentHour = new Date().getHours();
    const activeHourly = mockHourly.slice(0, currentHour + 1);
    
    if (hourlyAggs.length === 0) return activeHourly;

    return activeHourly.map((mockHour) => {
      const hourNum = parseInt(mockHour.time.split(":")[0]!, 10);
      const match = hourlyAggs.find((row) => row.hourVal === hourNum);

      if (!match) return mockHour;

      const temperature = match.avg_temp != null ? Math.round(match.avg_temp * 10) / 10 : mockHour.temperature;
      const humidity = match.avg_hum != null ? Math.round(match.avg_hum) : mockHour.humidity;
      const tvoc = match.avg_voc != null ? Math.round(match.avg_voc) : mockHour.tvoc;

      const waterFromFlow = match.total_flow_rate != null ? match.total_flow_rate / 6 : 0;
      const waterFromVolume = (match.max_vol != null && match.min_vol != null) ? (match.max_vol - match.min_vol) : 0;
      const waterConsumedLiters = Math.round(Math.max(waterFromFlow, waterFromVolume) * 10) / 10;

      return {
        time: mockHour.time,
        waterConsumedLiters: waterConsumedLiters || mockHour.waterConsumedLiters,
        temperature,
        humidity,
        tvoc,
      };
    });
  }, [hourlyAggs]);

  // Calculate telemetry insights from merged data
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
