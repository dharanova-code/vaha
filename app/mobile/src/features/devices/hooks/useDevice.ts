import { useEffect } from "react";
import { useDeviceStore } from "../stores/deviceStore";
import { useCaptureStore } from "../stores/captureStore";
import { useSettingsStore } from "../../settings/stores/settingsStore";

export function useDevice() {
  const { 
    connectionStatus, 
    deviceIp, 
    deviceStatus, 
    lastError, 
    connect, 
    disconnect, 
    refreshStatus 
  } = useDeviceStore();

  const { syncFromDevice, resumeSyncQueue } = useCaptureStore();
  const { autoSync } = useSettingsStore();

  useEffect(() => {
    if (connectionStatus === "connected") {
      refreshStatus();
      if (autoSync) {
        syncFromDevice();
      } else {
        resumeSyncQueue();
      }
    }
  }, [connectionStatus, autoSync, refreshStatus, syncFromDevice, resumeSyncQueue]);

  return {
    connectionStatus,
    deviceIp,
    deviceStatus,
    lastError,
    connect,
    disconnect,
    refreshStatus
  };
}
