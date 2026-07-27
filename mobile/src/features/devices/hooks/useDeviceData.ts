import { useState, useCallback } from "react";
import { useDevice } from "./useDevice";
import { useLiveSensors } from "./useLiveSensors";
import { useCaptureStore } from "../stores/captureStore";
import { useSettingsStore } from "../../settings/stores/settingsStore";

/**
 * useDeviceData — presentation hook for the Device management screen.
 *
 * Composes data from existing hooks and stores. All I/O delegates to
 * existing application services — no transport or repository access here.
 */
export function useDeviceData() {
  const {
    connectionStatus,
    deviceIp,
    deviceStatus,
    lastError,
    connect,
    disconnect,
    refreshStatus,
  } = useDevice();

  const liveSensors = useLiveSensors();

  const { isSyncing, syncProgress, syncFromDevice } = useCaptureStore();
  const { serverIp } = useSettingsStore();

  // Local IP input state — initialised from persisted settings
  const [ipInput, setIpInput] = useState(deviceIp ?? serverIp ?? "192.168.");

  // Derived presentation values
  const isConnected = connectionStatus === "connected";
  const isConnecting = connectionStatus === "connecting";
  const isOffline = connectionStatus === "disconnected";
  const isError = connectionStatus === "error";

  const connectLabel = isConnected
    ? "Disconnect"
    : isConnecting
    ? "Connecting…"
    : "Connect";

  const uptimeLabel = deviceStatus?.uptime_seconds != null
    ? `${Math.floor(deviceStatus.uptime_seconds / 3600)}h ${Math.floor((deviceStatus.uptime_seconds % 3600) / 60)}m`
    : "--";

  const vocStatus =
    liveSensors?.voc_parts_per_billion != null &&
    liveSensors.voc_parts_per_billion > 1000
      ? ("warning" as const)
      : ("normal" as const);

  const syncLabel = isSyncing
    ? `Syncing (${Math.round(syncProgress)}%)`
    : "Sync Captures";

  // Actions
  const handleConnectToggle = useCallback(() => {
    if (isConnected) {
      disconnect();
    } else {
      connect(ipInput);
    }
  }, [isConnected, connect, disconnect, ipInput]);

  const handleSync = useCallback(() => {
    syncFromDevice();
  }, [syncFromDevice]);

  const handleRefreshStatus = useCallback(() => {
    refreshStatus();
  }, [refreshStatus]);

  return {
    // Connection
    connectionStatus,
    isConnected,
    isConnecting,
    isOffline,
    isError,
    lastError,
    connectLabel,
    // IP input
    ipInput,
    setIpInput,
    // Device info
    deviceStatus,
    uptimeLabel,
    // Live sensors
    liveSensors,
    vocStatus,
    // Sync
    isSyncing,
    syncProgress,
    syncLabel,
    // Actions
    handleConnectToggle,
    handleSync,
    handleRefreshStatus,
  };
}
