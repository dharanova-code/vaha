import { Logger } from "../../../core/logger/Logger";
import { ProvisioningService } from "./BleProvisioningTypes";

export * from "./BleProvisioningTypes";

export function createProvisioningService(logger: Logger): ProvisioningService {
  let isExpoGo = false;
  try {
    const Constants = require("expo-constants").default || require("expo-constants");
    isExpoGo = Constants.executionEnvironment === "store-client" || Constants.appOwnership === "expo";
  } catch (e) {
    // ignore
  }

  if (isExpoGo) {
    const { ExpoGoProvisioningService } = require("./ExpoGoProvisioningService");
    return new ExpoGoProvisioningService();
  }
  
  try {
    const { NativeBleProvisioningService } = require("./NativeBleProvisioningService");
    return new NativeBleProvisioningService(logger);
  } catch (e) {
    const { ExpoGoProvisioningService } = require("./ExpoGoProvisioningService");
    return new ExpoGoProvisioningService();
  }
}
