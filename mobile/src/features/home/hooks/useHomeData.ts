import { useCallback } from "react";
import { useDeviceStore } from "../../devices/stores/deviceStore";
import { useCaptureStore } from "../../devices/stores/captureStore";

/**
 * useHomeData — presentation hook for the Home dashboard.
 *
 * Composes data from existing stores WITHOUT performing any I/O directly.
 * All networking, database access, and sync logic remains in the stores.
 * This hook only selects, derives, and memoizes the values the screen needs.
 */
export function useHomeData() {
  const {
    connectionStatus,
    deviceStatus,
    liveSensors,
    refreshStatus,
    refreshSensors,
  } = useDeviceStore();

  const {
    captures,
    isLoading,
    isSyncing,
    syncProgress,
    loadLocalCaptures,
  } = useCaptureStore();

  // Derived values — computed once here, not inside JSX
  const isConnected = connectionStatus === "connected";
  const isOffline = connectionStatus === "disconnected";
  const todayCount = captures.length;
  const temperature = liveSensors?.temperature_celsius ?? null;

  // Pull-to-refresh delegates to existing store actions — no duplication
  const onRefresh = useCallback(async () => {
    await Promise.all([
      refreshStatus(),
      refreshSensors(),
      loadLocalCaptures(),
    ]);
  }, [refreshStatus, refreshSensors, loadLocalCaptures]);

  return {
    // Connection
    connectionStatus,
    isConnected,
    isOffline,
    // Device status
    deviceStatus,
    // Sensors
    temperature,
    liveSensors,
    // Captures
    captures,
    todayCount,
    isLoading,
    isSyncing,
    syncProgress,
    // Actions
    onRefresh,
  };
}
