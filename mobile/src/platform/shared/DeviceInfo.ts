import * as Device from "expo-device";

export interface DeviceInfo {
  getDeviceModel(): string | null;
  getOSVersion(): string | null;
}

export class ExpoDeviceInfo implements DeviceInfo {
  public getDeviceModel(): string | null {
    return Device.modelName;
  }

  public getOSVersion(): string | null {
    return Device.osVersion;
  }
}
