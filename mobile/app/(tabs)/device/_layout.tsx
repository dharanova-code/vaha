import { Stack } from "expo-router";

/**
 * Device tab stack layout.
 * All device management (Wi-Fi, BLE scan, provisioning, sensors, sync)
 * is handled inline on the index screen — no sub-routes needed.
 */
export default function DeviceTabLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
