import { create } from "zustand";
import { DeviceStatus, LiveSensorReading } from "../models/DeviceStatus";
import { Container } from "@core/di/Container";
import { DeviceClient } from "../client/DeviceClient";
import { Database } from "@infra/database/config/Database";

export interface DeviceState {
  connectionStatus: "disconnected" | "connecting" | "connected" | "error";
  deviceIp: string | null;
  deviceStatus: DeviceStatus | null;
  liveSensors: LiveSensorReading | null;
  lastError: string | null;
  
  connect: (ip: string) => Promise<void>;
  disconnect: () => Promise<void>;
  refreshStatus: () => Promise<void>;
  refreshSensors: () => Promise<void>;
  setServerIp: (ip: string) => void;
  setLiveSensors: (sensors: LiveSensorReading) => void;
  setDevice: (info: { uuid: string; name: string }) => void;
}

export const useDeviceStore = create<DeviceState>((set, get) => ({
  connectionStatus: "disconnected",
  deviceIp: null,
  deviceStatus: null,
  liveSensors: null,
  lastError: null,

  connect: async (ip: string) => {
    set({ connectionStatus: "connecting", lastError: null, deviceIp: ip });
    const client = Container.getInstance().resolve<DeviceClient>("DeviceClient");
    const result = await client.connect(ip);
    
    if (result.isSuccess) {
      set({ connectionStatus: "connected", lastError: null });
      get().refreshStatus();
      get().refreshSensors();

      // Clean up previous subscription if any
      if ((get() as any)._unsubscribeWebSocket) {
        (get() as any)._unsubscribeWebSocket();
      }

      // Subscribe to WebSocket telemetry updates
      const unsubscribe = client.subscribe((msg: any) => {
        if (msg && msg.type === "telemetry") {
          const reading = msg.payload as LiveSensorReading;
          set({ liveSensors: reading });

          // Store locally in the SQLite database
          try {
            const expoDb = Database.getInstance().getExpoDb();
            const timestampMs = new Date(reading.sampled_at).getTime();
            
            expoDb.runSync(
              `INSERT INTO sensor_logs (timestamp, temperature, humidity, voc, flow_rate, accumulated_volume)
               VALUES (?, ?, ?, ?, ?, ?);`,
              [
                timestampMs,
                reading.temperature_celsius,
                reading.humidity_percentage,
                reading.voc_parts_per_billion,
                reading.flow_rate_liters_per_minute,
                reading.accumulated_volume_liters,
              ]
            );
          } catch (err) {
            console.warn("[DeviceStore] Failed to write live sensor log to local database", err);
          }
        }
      });

      (get() as any)._unsubscribeWebSocket = unsubscribe;
    } else {
      set({ connectionStatus: "error", lastError: result.getErrorOrThrow().message });
    }
  },

  disconnect: async () => {
    const client = Container.getInstance().resolve<DeviceClient>("DeviceClient");
    await client.disconnect();
    
    if ((get() as any)._unsubscribeWebSocket) {
      (get() as any)._unsubscribeWebSocket();
      (get() as any)._unsubscribeWebSocket = null;
    }

    set({ connectionStatus: "disconnected", deviceStatus: null, liveSensors: null });
  },

  refreshStatus: async () => {
    const client = Container.getInstance().resolve<DeviceClient>("DeviceClient");
    if (!client.isConnected) return;
    
    const result = await client.status();
    if (result.isSuccess) {
      set({ deviceStatus: result.getValueOrThrow() });
    }
  },

  refreshSensors: async () => {
    const client = Container.getInstance().resolve<DeviceClient>("DeviceClient");
    if (!client.isConnected) return;
    
    const result = await client.getSensors();
    if (result.isSuccess) {
      const reading = result.getValueOrThrow();
      set({ liveSensors: reading });
      
      // Store locally in the SQLite database
      try {
        const expoDb = Database.getInstance().getExpoDb();
        const timestampMs = new Date(reading.sampled_at).getTime();
        
        expoDb.runSync(
          `INSERT INTO sensor_logs (timestamp, temperature, humidity, voc, flow_rate, accumulated_volume)
           VALUES (?, ?, ?, ?, ?, ?);`,
          [
            timestampMs,
            reading.temperature_celsius,
            reading.humidity_percentage,
            reading.voc_parts_per_billion,
            reading.flow_rate_liters_per_minute,
            reading.accumulated_volume_liters,
          ]
        );
      } catch (err) {
        console.warn("[DeviceStore] Failed to write sensor log to local database", err);
      }
    }
  },

  setServerIp: (ip: string) => {
    set({ deviceIp: ip });
  },
  
  setLiveSensors: (sensors: LiveSensorReading) => {
      set({ liveSensors: sensors });
  },
  
  setDevice: (info: { uuid: string; name: string }) => {
      // In a full implementation, we'd persist this to DeviceRepository too.
      // For now, we keep it simple.
  }
}));
