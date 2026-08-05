import { ProvisioningService, DiscoveredBleDevice, Device } from "./BleProvisioningTypes";
import { Logger } from "../../../core/logger/Logger";
import { Result } from "../../../core/utils/Result";
import { Buffer } from "buffer";

export class NativeBleProvisioningService implements ProvisioningService {
  private manager: any;
  private logger: Logger;
  private readonly PROVISIONING_SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0";
  private readonly CREDENTIALS_CHAR_UUID = "12345678-1234-5678-1234-56789abcdef1";
  private readonly STATUS_CHAR_UUID = "12345678-1234-5678-1234-56789abcdef2";
  private scanTimeoutHandle: ReturnType<typeof setTimeout> | null = null;

  constructor(logger: Logger) {
    this.logger = logger;
    const { BleManager } = require("react-native-ble-plx");
    this.manager = new BleManager();
  }

  public async checkAdapterState(): Promise<Result<any, Error>> {
    try {
      const state = await this.manager.state();
      if (state === "Unsupported") {
        return Result.fail(new Error("Bluetooth LE is not supported on this device."));
      }
      return Result.ok(state);
    } catch (e) {
      return Result.fail(e instanceof Error ? e : new Error("Failed to get Bluetooth state."));
    }
  }

  public async waitForState(state: any): Promise<void> {
    const currentState = await this.manager.state();
    if (currentState === state) return;

    return new Promise((resolve) => {
      const subscription = this.manager.onStateChange((newState: any) => {
        if (newState === state) {
          subscription.remove();
          resolve();
        }
      }, true);
    });
  }

  public startScanning(
    onDeviceFound: (device: DiscoveredBleDevice) => void,
    onError: (error: Error) => void,
    timeoutMs: number = 15000
  ): void {
    this.logger.info("[BLE] Starting scan for VAHA devices...");
    this.manager.startDeviceScan(null, null, (error: any, scannedDevice: any) => {
      if (error) {
        this.logger.error("[BLE] Scan error", error);
        this.stopScanning();
        onError(error);
        return;
      }
      if (scannedDevice) {
        onDeviceFound({
          id: scannedDevice.id,
          name: scannedDevice.name || "Unknown Device",
          rssi: scannedDevice.rssi,
        });
      }
    });

    if (timeoutMs > 0) {
      this.scanTimeoutHandle = setTimeout(() => {
        this.stopScanning();
        onError(new Error("Scan timeout reached."));
      }, timeoutMs);
    }
  }

  public stopScanning(): void {
    this.logger.info("[BLE] Stopping scan");
    this.manager.stopDeviceScan();
    if (this.scanTimeoutHandle) {
      clearTimeout(this.scanTimeoutHandle);
      this.scanTimeoutHandle = null;
    }
  }

  public async connectToDevice(deviceId: string): Promise<Result<Device, Error>> {
    try {
      this.logger.info(`[BLE] Connecting to ${deviceId}`);
      const device = await this.manager.connectToDevice(deviceId);
      this.logger.info(`[BLE] Discovering services for ${deviceId}`);
      await device.discoverAllServicesAndCharacteristics();
      return Result.ok(device);
    } catch (err) {
      this.logger.error(`[BLE] Connect error:`, err);
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public async sendWifiCredentials(device: Device, ssid: string, pass: string): Promise<Result<void, Error>> {
    try {
      this.logger.info(`[BLE] Sending Wi-Fi credentials to ${device.id}`);
      const payload = JSON.stringify({ ssid, pass });
      const b64 = Buffer.from(payload).toString("base64");
      
      await device.writeCharacteristicWithResponseForService(
        this.PROVISIONING_SERVICE_UUID,
        this.CREDENTIALS_CHAR_UUID,
        b64
      );
      return Result.ok(undefined);
    } catch (err) {
      this.logger.error(`[BLE] Credentials send error:`, err);
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public async verifyProvisioningStatus(device: Device): Promise<Result<{ ip: string }, Error>> {
    try {
      this.logger.info(`[BLE] Verifying provisioning status for ${device.id}`);
      for (let i = 0; i < 15; i++) {
        const char = await device.readCharacteristicForService(
          this.PROVISIONING_SERVICE_UUID,
          this.STATUS_CHAR_UUID
        );
        if (char.value) {
          const jsonStr = Buffer.from(char.value, "base64").toString("utf-8");
          const status = JSON.parse(jsonStr);
          if (status.status === "connected" && status.ip) {
            this.logger.info(`[BLE] Device connected to Wi-Fi with IP ${status.ip}`);
            return Result.ok({ ip: status.ip });
          } else if (status.status === "failed") {
            return Result.fail(new Error("Device failed to connect to Wi-Fi"));
          }
        }
        await new Promise(res => setTimeout(res, 2000));
      }
      return Result.fail(new Error("Timeout waiting for Wi-Fi connection"));
    } catch (err) {
      this.logger.error(`[BLE] Verify status error:`, err);
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public async disconnect(deviceId: string): Promise<void> {
    try {
      await this.manager.cancelDeviceConnection(deviceId);
    } catch (_e) {
      // Ignore
    }
  }

  public destroy(): void {
    this.manager.destroy();
  }
}
