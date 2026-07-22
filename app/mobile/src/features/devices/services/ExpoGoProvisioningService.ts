import { Alert } from "react-native";
import { ProvisioningService, DiscoveredBleDevice, Device } from "./BleProvisioningTypes";
import { Result } from "../../../core/utils/Result";

export class ExpoGoProvisioningService implements ProvisioningService {
  private showDialog() {
    Alert.alert(
      "Provisioning Unsupported",
      "Device provisioning requires a Development Build.\n\nExpo Go does not include Bluetooth Low Energy native support."
    );
  }

  public async checkAdapterState(): Promise<Result<any, Error>> {
    this.showDialog();
    return Result.fail(new Error("BLE is not supported inside Expo Go."));
  }

  public async waitForState(state: any): Promise<void> {
    return Promise.resolve();
  }

  public startScanning(
    onDeviceFound: (device: DiscoveredBleDevice) => void,
    onError: (error: Error) => void,
    timeoutMs?: number
  ): void {
    this.showDialog();
    onError(new Error("BLE scanning is unsupported in Expo Go."));
  }

  public stopScanning(): void {}

  public async connectToDevice(deviceId: string): Promise<Result<Device, Error>> {
    return Result.fail(new Error("BLE connection is unsupported in Expo Go."));
  }

  public async sendWifiCredentials(device: Device, ssid: string, pass: string): Promise<Result<void, Error>> {
    return Result.fail(new Error("BLE Wi-Fi credentials send is unsupported in Expo Go."));
  }

  public async verifyProvisioningStatus(device: Device): Promise<Result<{ ip: string }, Error>> {
    return Result.fail(new Error("BLE status verification is unsupported in Expo Go."));
  }

  public async disconnect(deviceId: string): Promise<void> {}

  public destroy(): void {}
}
