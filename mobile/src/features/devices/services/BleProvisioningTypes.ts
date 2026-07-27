import { Result } from "../../../core/utils/Result";

export interface DiscoveredBleDevice {
  id: string;
  name: string;
  rssi: number | null;
}

export interface Device {
  id: string;
  name: string | null;
  rssi: number | null;
  discoverAllServicesAndCharacteristics: () => Promise<Device>;
  readCharacteristicForService: (s: string, c: string) => Promise<{ value: string | null }>;
  writeCharacteristicWithResponseForService: (s: string, c: string, v: string) => Promise<unknown>;
}

export type ProvisioningStatus = 
  | "idle" 
  | "scanning" 
  | "connecting" 
  | "discovering_services" 
  | "sending_credentials" 
  | "waiting_for_wifi" 
  | "discovering_device"
  | "verifying_health"
  | "syncing"
  | "success" 
  | "error";

export const State = {
  Unknown: "Unknown",
  Resetting: "Resetting",
  Unsupported: "Unsupported",
  Unauthorized: "Unauthorized",
  PoweredOff: "PoweredOff",
  PoweredOn: "PoweredOn",
};

export interface ProvisioningService {
  checkAdapterState(): Promise<Result<any, Error>>;
  waitForState(state: any): Promise<void>;
  startScanning(
    onDeviceFound: (device: DiscoveredBleDevice) => void,
    onError: (error: Error) => void,
    timeoutMs?: number
  ): void;
  stopScanning(): void;
  connectToDevice(deviceId: string): Promise<Result<Device, Error>>;
  sendWifiCredentials(device: Device, ssid: string, pass: string): Promise<Result<void, Error>>;
  verifyProvisioningStatus(device: Device): Promise<Result<{ ip: string }, Error>>;
  disconnect(deviceId: string): Promise<void>;
  destroy(): void;
}
