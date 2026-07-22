export interface DeviceCardProps {
  name: string;
  status: "connected" | "connecting" | "disconnected";
  batteryLevel?: number;
  onPress?: () => void;
}