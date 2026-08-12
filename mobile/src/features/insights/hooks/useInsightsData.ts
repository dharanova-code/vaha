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
  const [dbLogs, setDbLogs] = useState<any[]>([]);

  // Load real logs from SQLite database on mount or when live sensors are updated
  useEffect(() => {
    try {
      const expoDb = Database.getInstance().getExpoDb();
      const rows = expoDb.getAllSync<any>(
        "SELECT * FROM sensor_logs ORDER BY timestamp ASC;"
      );
      setDbLogs(rows || []);
    } catch (err) {
      console.warn("[useInsightsData] Failed to load sensor logs from SQLite", err);
    }
  }, [liveSensors]);

  // Merge real SQLite logs into 45-day daily logs
  const sensorLogs = useMemo(() => {
    const mockLogs = generate45DaySensorData();
    if (dbLogs.length === 0) return mockLogs;

    return mockLogs.map((mockLog) => {
      // Filter dbLogs belonging to this calendar date
      const dayLogs = dbLogs.filter((dbLog) => {
        const dbDate = new Date(dbLog.timestamp);
        const dbDateLabel = dbDate.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        });
        return dbDateLabel === mockLog.date;
      });

      if (dayLogs.length === 0) {
        return mockLog;
      }

      let tempSum = 0, tempCount = 0;
      let humSum = 0, humCount = 0;
      let vocSum = 0, vocCount = 0;
      let flowRateSum = 0;
      let maxAccVol = 0, minAccVol = Infinity;

      dayLogs.forEach((l) => {
        if (l.temperature !== null && l.temperature !== undefined) {
          tempSum += l.temperature;
          tempCount++;
        }
        if (l.humidity !== null && l.humidity !== undefined) {
          humSum += l.humidity;
          humCount++;
        }
        if (l.voc !== null && l.voc !== undefined) {
          vocSum += l.voc;
          vocCount++;
        }
        if (l.flow_rate !== null && l.flow_rate !== undefined) {
          flowRateSum += l.flow_rate;
        }
        if (l.accumulated_volume !== null && l.accumulated_volume !== undefined) {
          if (l.accumulated_volume > maxAccVol) maxAccVol = l.accumulated_volume;
          if (l.accumulated_volume < minAccVol) minAccVol = l.accumulated_volume;
        }
      });

      const averageTemperature = tempCount > 0 ? Math.round((tempSum / tempCount) * 10) / 10 : mockLog.averageTemperature;
      const averageHumidity = humCount > 0 ? Math.round(humSum / humCount) : mockLog.averageHumidity;
      const averageTVOC = vocCount > 0 ? Math.round(vocSum / vocCount) : mockLog.averageTVOC;

      const waterFromFlow = flowRateSum / 6; // Polled every 10s -> flow_rate * (10s/60s)
      const waterFromVolume = minAccVol !== Infinity ? (maxAccVol - minAccVol) : 0;
      const waterConsumedLiters = Math.round(Math.max(waterFromFlow, waterFromVolume) * 10) / 10;

      // Anomaly detection for real daily usage
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
  }, [dbLogs]);

  // Merge real SQLite logs into 24-hour hourly logs
  const hourlyLogs = useMemo(() => {
    const mockHourly = generateHourlySensorData();
    if (dbLogs.length === 0) return mockHourly;

    // Filter dbLogs to only today's logs
    const todayLabel = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });

    const todayDbLogs = dbLogs.filter((dbLog) => {
      const dbDate = new Date(dbLog.timestamp);
      const dbDateLabel = dbDate.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });
      return dbDateLabel === todayLabel;
    });

    if (todayDbLogs.length === 0) return mockHourly;

    return mockHourly.map((mockHour) => {
      const hourNum = parseInt(mockHour.time.split(":")[0]!, 10);
      const hourLogs = todayDbLogs.filter((l) => {
        const dbDate = new Date(l.timestamp);
        return dbDate.getHours() === hourNum;
      });

      if (hourLogs.length === 0) {
        return mockHour;
      }

      let tempSum = 0, tempCount = 0;
      let humSum = 0, humCount = 0;
      let vocSum = 0, vocCount = 0;
      let flowRateSum = 0;
      let maxAccVol = 0, minAccVol = Infinity;

      hourLogs.forEach((l) => {
        if (l.temperature !== null && l.temperature !== undefined) {
          tempSum += l.temperature;
          tempCount++;
        }
        if (l.humidity !== null && l.humidity !== undefined) {
          humSum += l.humidity;
          humCount++;
        }
        if (l.voc !== null && l.voc !== undefined) {
          vocSum += l.voc;
          vocCount++;
        }
        if (l.flow_rate !== null && l.flow_rate !== undefined) {
          flowRateSum += l.flow_rate;
        }
        if (l.accumulated_volume !== null && l.accumulated_volume !== undefined) {
          if (l.accumulated_volume > maxAccVol) maxAccVol = l.accumulated_volume;
          if (l.accumulated_volume < minAccVol) minAccVol = l.accumulated_volume;
        }
      });

      const temperature = tempCount > 0 ? Math.round((tempSum / tempCount) * 10) / 10 : mockHour.temperature;
      const humidity = humCount > 0 ? Math.round(humSum / humCount) : mockHour.humidity;
      const tvoc = vocCount > 0 ? Math.round(vocSum / vocCount) : mockHour.tvoc;

      const waterFromFlow = flowRateSum / 6;
      const waterFromVolume = minAccVol !== Infinity ? (maxAccVol - minAccVol) : 0;
      const waterConsumedLiters = Math.round(Math.max(waterFromFlow, waterFromVolume) * 10) / 10;

      return {
        time: mockHour.time,
        waterConsumedLiters: waterConsumedLiters || mockHour.waterConsumedLiters,
        temperature,
        humidity,
        tvoc,
      };
    });
  }, [dbLogs]);

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
