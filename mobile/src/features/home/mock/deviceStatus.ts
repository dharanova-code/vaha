export interface DeviceStatus {
  name: string;
  status: "connected" | "connecting" | "disconnected";
  batteryLevel: number;
  bleSignal: number;
}

export const deviceStatus: DeviceStatus = {
  name: "Vaha Companion Pod (00:1A:7D)",
  status: "connected",
  batteryLevel: 94,
  bleSignal: -54,
};
