import { create } from "zustand";
import { DeviceStatus, LiveSensorReading } from "../models/DeviceStatus";
import { Container } from "@core/di/Container";
import { DeviceClient } from "../client/DeviceClient";

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
    } else {
      set({ connectionStatus: "error", lastError: result.getErrorOrThrow().message });
    }
  },

  disconnect: async () => {
    const client = Container.getInstance().resolve<DeviceClient>("DeviceClient");
    await client.disconnect();
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
      set({ liveSensors: result.getValueOrThrow() });
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
