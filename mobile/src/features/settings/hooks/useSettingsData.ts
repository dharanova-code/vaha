import { useCallback } from "react";
import { useSettingsStore } from "../stores/settingsStore";

/**
 * useSettingsData — presentation hook for the Settings screen.
 *
 * Encapsulates all data composition and persistence delegation.
 * The screen consumes only this hook — no direct store or repo access.
 */
export function useSettingsData() {
  const { autoSync, setAutoSync, serverIp, retentionDays, setRetentionDays, loadSettings } = useSettingsStore();

  const handleToggleAutoSync = useCallback(
    (value: boolean) => {
      setAutoSync(value);
    },
    [setAutoSync],
  );

  const handleCycleRetention = useCallback(() => {
    const options = [7, 30, 90, 0]; // 0 means forever
    const currentIndex = options.indexOf(retentionDays);
    const nextIndex = (currentIndex + 1) % options.length;
    setRetentionDays(options[nextIndex] ?? 30);
  }, [retentionDays, setRetentionDays]);

  return {
    autoSync,
    handleToggleAutoSync,
    serverIp,
    retentionDays,
    handleCycleRetention,
    loadSettings,
  };
}
