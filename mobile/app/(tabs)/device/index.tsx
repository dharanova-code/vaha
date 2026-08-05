import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useDevice } from "../../../src/features/devices/hooks/useDevice";
import { useBleProvisioning } from "../../../src/features/devices/hooks/useBleProvisioning";
import { useLiveSensors } from "../../../src/features/devices/hooks/useLiveSensors";
import { useCaptureStore } from "../../../src/features/devices/stores/captureStore";
import { useSettingsStore } from "../../../src/features/settings/stores/settingsStore";
import {
  Screen,
  Text,
  Button,
  SectionHeader,
  Card,
  DeviceCard,
  SensorCard,
  theme,
} from "../../../src/design-system";
import { DiscoveredBleDevice } from "../../../src/features/devices/services/BleProvisioningService";

// ─── Types ───────────────────────────────────────────────────────────────────
type PanelMode = "wifi" | "ble" | "provision";

const WIFI_SUGGESTIONS = [
  { ip: "192.168.1.100", hint: "Router subnet A" },
  { ip: "192.168.0.100", hint: "Router subnet B" },
  { ip: "192.168.4.1",   hint: "AP mode default" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function statusColor(s: string) {
  if (s === "connected")   return theme.colors.semantic.success;
  if (s === "connecting")  return theme.colors.accent.primary;
  if (s === "error")       return theme.colors.semantic.error;
  return theme.colors.text.muted;
}

function statusDot(s: string) {
  return (
    <View
      style={[
        styles.statusDot,
        { backgroundColor: statusColor(s) },
      ]}
    />
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function DeviceScreen() {
  // Wi-Fi connection
  const {
    connectionStatus,
    deviceIp,
    deviceStatus,
    lastError: connectError,
    connect,
    disconnect,
    refreshStatus,
  } = useDevice();

  const liveSensors = useLiveSensors();
  const { isSyncing, syncProgress, syncFromDevice } = useCaptureStore();
  const { serverIp } = useSettingsStore();

  const isConnected  = connectionStatus === "connected";
  const isConnecting = connectionStatus === "connecting";
  const isError      = connectionStatus === "error";

  const [ipInput, setIpInput] = useState(deviceIp ?? serverIp ?? "192.168.");

  // BLE provisioning
  const {
    status: bleStatus,
    devices: bleDevices,
    lastError: bleError,
    startScanning,
    stopScanning,
    provisionDevice,
    reset: resetBle,
  } = useBleProvisioning();

  const [panelMode, setPanelMode] = useState<PanelMode | null>(null);
  const [bleTargetDevice, setBleTargetDevice] = useState<DiscoveredBleDevice | null>(null);
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  
  const [isScanningWifi, setIsScanningWifi] = useState(false);
  const [wifiNetworks, setWifiNetworks] = useState<{ssid: string, rssi: number, secure: boolean}[]>([]);

  const isBleScanActive = bleStatus === "scanning";
  const isBleProvisioning =
    bleStatus === "connecting" ||
    bleStatus === "discovering_services" ||
    bleStatus === "sending_credentials" ||
    bleStatus === "waiting_for_wifi" ||
    bleStatus === "discovering_device" ||
    bleStatus === "verifying_health" ||
    bleStatus === "syncing";

  // Auto-close panel when connected
  useEffect(() => {
    if (isConnected && panelMode === "wifi") {
      setPanelMode(null);
    }
  }, [isConnected, panelMode]);

  // ── Actions ─────────────────────────────────────────────────────────────
  const handleConnectWifi = useCallback(async (ip: string) => {
    await connect(ip);
  }, [connect]);

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  const handleSync = useCallback(() => {
    syncFromDevice();
  }, [syncFromDevice]);

  const handleBleDeviceSelect = useCallback((device: DiscoveredBleDevice) => {
    stopScanning();
    setBleTargetDevice(device);
    setPanelMode("provision");
  }, [stopScanning]);

  const handleProvision = useCallback(() => {
    if (!bleTargetDevice || !wifiSsid.trim() || !wifiPass.trim()) return;
    provisionDevice(bleTargetDevice, wifiSsid.trim(), wifiPass.trim());
  }, [bleTargetDevice, wifiSsid, wifiPass, provisionDevice]);

  const handleResetBle = useCallback(() => {
    resetBle();
    setBleTargetDevice(null);
    setWifiSsid("");
    setWifiPass("");
    setWifiNetworks([]);
    setPanelMode(null);
  }, [resetBle]);

  const handleScanWifi = useCallback(() => {
    setIsScanningWifi(true);
    // Simulate UNO Q hardware taking a few seconds to scan networks
    setTimeout(() => {
      setWifiNetworks([
        { ssid: "Home Network 5G", rssi: -45, secure: true },
        { ssid: "VAHA_Guest", rssi: -60, secure: true },
        { ssid: "Public_WiFi", rssi: -85, secure: false },
        { ssid: "Starbucks WiFi", rssi: -90, secure: false },
      ]);
      setIsScanningWifi(false);
    }, 2000);
  }, []);

  const handleOpenBle = useCallback(() => {
    setPanelMode(mode => mode === "ble" ? null : "ble");
  }, []);

  const handleOpenWifi = useCallback(() => {
    setPanelMode(mode => mode === "wifi" ? null : "wifi");
  }, []);

  // Status label
  const uptimeLabel = deviceStatus?.uptime_seconds != null
    ? `${Math.floor(deviceStatus.uptime_seconds / 3600)}h ${Math.floor((deviceStatus.uptime_seconds % 3600) / 60)}m`
    : "--";

  const vocStatus =
    (liveSensors?.voc_parts_per_billion ?? 0) > 1000 ? "warning" as const : "normal" as const;

  const syncLabel = isSyncing
    ? `Syncing (${Math.round(syncProgress)}%)`
    : "Sync Captures";

  const provisionStatusLabel: Record<string, string> = {
    connecting:          "Connecting to device…",
    discovering_services:"Discovering services…",
    sending_credentials: "Sending Wi-Fi credentials…",
    waiting_for_wifi:    "Waiting for Wi-Fi…",
    discovering_device:  "Locating on network…",
    verifying_health:    "Verifying connection…",
    syncing:             "Syncing captures…",
    success:             "All done!",
    error:               "Something went wrong",
  };

  return (
    <Screen scrollable style={styles.container}>

      {/* ── Page Header ─────────────────────────────────── */}
      <View style={styles.pageHeader}>
        <View>
          <Text variant="headline-lg" style={styles.pageTitle}>UNO Q Device</Text>
          <View style={styles.statusRow}>
            {statusDot(connectionStatus)}
            <Text variant="meta-sm" style={{ color: statusColor(connectionStatus) }}>
              {isConnected
                ? `Connected · ${deviceIp ?? ""}`
                : isConnecting
                ? "Connecting…"
                : isError
                ? "Connection error"
                : "Not connected"}
            </Text>
          </View>
        </View>

        {isConnected && (
          <TouchableOpacity
            style={styles.refreshBtn}
            onPress={refreshStatus}
            accessibilityLabel="Refresh device status"
          >
            <Feather name="refresh-cw" size={18} color={theme.colors.text.muted} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Connected: Device Status ────────────────────── */}
      {isConnected && deviceStatus && (
        <>
          <DeviceCard
            name="Arduino Uno Q"
            status="connected"
            batteryLevel={deviceStatus.battery_percentage ?? 100}
          />

          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Text variant="label-sm" style={styles.metaLabel}>FIRMWARE</Text>
              <Text variant="mono-bold" style={styles.metaValue}>
                {deviceStatus.firmware_version ?? "--"}
              </Text>
            </View>
            <View style={styles.metaChip}>
              <Text variant="label-sm" style={styles.metaLabel}>UPTIME</Text>
              <Text variant="mono-bold" style={styles.metaValue}>{uptimeLabel}</Text>
            </View>
            <View style={styles.metaChip}>
              <Text variant="label-sm" style={styles.metaLabel}>BUFFERED</Text>
              <Text variant="mono-bold" style={styles.metaValue}>
                {deviceStatus.buffered_captures_count ?? 0}
              </Text>
            </View>
          </View>
        </>
      )}

      {/* ── Connected: Live Sensors ─────────────────────── */}
      {isConnected && (
        <>
          <SectionHeader title="Live Sensors" />
          <View style={styles.sensorGrid}>
            <SensorCard
              label="TEMP"
              value={liveSensors?.temperature_celsius?.toFixed(1) ?? "--"}
              unit="°C"
              status="normal"
            />
            <SensorCard
              label="HUMIDITY"
              value={liveSensors?.humidity_percentage?.toFixed(0) ?? "--"}
              unit="%"
              status="normal"
            />
            <SensorCard
              label="TVOC"
              value={liveSensors?.voc_parts_per_billion?.toString() ?? "--"}
              unit="ppb"
              status={vocStatus}
            />
            <SensorCard
              label="FLOW"
              value={liveSensors?.flow_rate_liters_per_minute?.toFixed(1) ?? "--"}
              unit="L/m"
              status="normal"
            />
          </View>
        </>
      )}

      {/* ── Connected: Quick Actions ────────────────────── */}
      {isConnected && (
        <>
          <SectionHeader title="Actions" />
          <View style={styles.actionRow}>
            <Button
              variant="primary"
              onPress={handleSync}
              disabled={isSyncing}
              style={styles.actionBtn}
            >
              {syncLabel}
            </Button>
            <Button
              variant="outline"
              onPress={handleDisconnect}
              style={styles.actionBtn}
            >
              Disconnect
            </Button>
          </View>
        </>
      )}

      {/* ── Connection Error Banner ─────────────────────── */}
      {isError && connectError && (
        <View style={styles.errorBanner}>
          <Feather name="alert-circle" size={16} color={theme.colors.semantic.error} />
          <Text variant="meta-sm" style={styles.errorText}>{connectError}</Text>
        </View>
      )}

      {/* ══ Connection Panel ════════════════════════════════════════════════ */}
      <SectionHeader title="Connect to Device" />

      {/* Toggle buttons */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, panelMode === "wifi" && styles.toggleBtnActive]}
          onPress={handleOpenWifi}
        >
          <Feather
            name="wifi"
            size={15}
            color={panelMode === "wifi" ? theme.colors.text.primary : theme.colors.text.muted}
          />
          <Text
            variant="mono-bold"
            style={[styles.toggleLabel, panelMode === "wifi" && styles.toggleLabelActive]}
          >
            WI-FI
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleBtn, panelMode === "ble" && styles.toggleBtnActive]}
          onPress={handleOpenBle}
        >
          <Feather
            name="bluetooth"
            size={15}
            color={panelMode === "ble" ? theme.colors.text.primary : theme.colors.text.muted}
          />
          <Text
            variant="mono-bold"
            style={[styles.toggleLabel, panelMode === "ble" && styles.toggleLabelActive]}
          >
            BLUETOOTH
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Wi-Fi Panel ─────────────────────────────────── */}
      {panelMode === "wifi" && (
        <Card style={styles.panel}>
          <Text variant="label-sm" style={styles.panelHint}>
            Enter IP address of your UNO Q on local Wi-Fi
          </Text>

          {/* Manual IP entry */}
          <View style={styles.ipRow}>
            <TextInput
              style={styles.ipInput}
              value={ipInput}
              onChangeText={setIpInput}
              placeholder="192.168.x.x"
              placeholderTextColor={theme.colors.text.muted}
              keyboardType="numeric"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isConnected && !isConnecting}
              accessibilityLabel="Device IP address"
            />
            <Button
              variant={isConnected ? "outline" : "primary"}
              onPress={() => isConnected ? handleDisconnect() : handleConnectWifi(ipInput)}
              disabled={isConnecting}
              style={styles.connectBtn}
            >
              {isConnected ? "Disconnect" : isConnecting ? "Connecting…" : "Connect"}
            </Button>
          </View>

          {/* Quick-connect suggestions */}
          <Text variant="label-sm" style={[styles.panelHint, { marginTop: 16 }]}>
            QUICK CONNECT
          </Text>
          {WIFI_SUGGESTIONS.map((s) => (
            <TouchableOpacity
              key={s.ip}
              style={styles.suggestionRow}
              onPress={() => {
                setIpInput(s.ip);
                handleConnectWifi(s.ip);
              }}
              disabled={isConnecting || isConnected}
            >
              <View style={styles.suggestionInfo}>
                <Feather name="server" size={14} color={theme.colors.accent.primary} />
                <View>
                  <Text variant="mono-bold" style={styles.suggestionIp}>{s.ip}</Text>
                  <Text variant="meta-sm" style={styles.mutedText}>{s.hint}</Text>
                </View>
              </View>
              <Feather name="zap" size={14} color={theme.colors.text.muted} />
            </TouchableOpacity>
          ))}
        </Card>
      )}

      {/* ── BLE Scan Panel ──────────────────────────────── */}
      {panelMode === "ble" && !isBleProvisioning && bleStatus !== "success" && (
        <Card style={styles.panel}>
          <Text variant="body-md" style={styles.panelHint}>
            Power on your UNO Q in{" "}
            <Text variant="mono-bold" style={{ color: theme.colors.accent.primary }}>
              setup mode
            </Text>{" "}
            (blinking blue LED), then scan.
          </Text>

          {bleError && (
            <View style={styles.errorBanner}>
              <Feather name="alert-circle" size={14} color={theme.colors.semantic.error} />
              <Text variant="meta-sm" style={styles.errorText}>{bleError}</Text>
            </View>
          )}

          <Button
            variant={isBleScanActive ? "outline" : "primary"}
            onPress={isBleScanActive ? stopScanning : startScanning}
            style={styles.scanBtn}
          >
            {isBleScanActive ? "Stop Scanning" : "Scan Bluetooth Devices"}
          </Button>

          {isBleScanActive && bleDevices.length === 0 && (
            <View style={styles.scanningRow}>
              <ActivityIndicator size="small" color={theme.colors.accent.primary} />
              <Text variant="meta-sm" style={styles.mutedText}>
                Searching for nearby devices…
              </Text>
            </View>
          )}

          {bleDevices.length > 0 && (
            <>
              <Text variant="label-sm" style={[styles.mutedText, { marginBottom: 8 }]}>
                {bleDevices.length} DEVICE{bleDevices.length !== 1 ? "S" : ""} FOUND
              </Text>
              {[...bleDevices].sort((a, b) => (b.rssi || -100) - (a.rssi || -100)).map((device) => {
                const isVaha = device.name?.toLowerCase().includes("vaha") || device.name?.toLowerCase().includes("uno");
                const rssi = device.rssi || -100;
                let signalIcon = "wifi-off";
                if (rssi > -60) signalIcon = "wifi"; // strong
                else if (rssi > -80) signalIcon = "wifi"; // medium
                else signalIcon = "wifi"; // weak
                
                return (
                <TouchableOpacity
                  key={device.id}
                  style={styles.bleDeviceRow}
                  onPress={() => handleBleDeviceSelect(device)}
                >
                  <View style={styles.bleDeviceInfo}>
                    <View style={[styles.iconBox, isVaha && { backgroundColor: `${theme.colors.accent.primary}20` }]}>
                      <Feather 
                        name={isVaha ? "cpu" : "bluetooth"} 
                        size={16} 
                        color={isVaha ? theme.colors.accent.primary : theme.colors.text.muted} 
                      />
                    </View>
                    <View>
                      <Text variant="body-md" style={[styles.bleDeviceName, isVaha && { fontWeight: 'bold' }]}>
                        {device.name}
                      </Text>
                      <Text variant="meta-sm" style={styles.mutedText}>
                         {device.id.slice(0, 12)}…
                      </Text>
                    </View>
                  </View>
                  <View style={{flexDirection: "row", alignItems: "center", gap: 8}}>
                    <Feather name={signalIcon as any} size={14} color={theme.colors.text.muted} />
                  </View>
                  <View style={styles.selectChip}>
                    <Text variant="label-sm" style={styles.selectChipText}>SELECT</Text>
                  </View>
                </TouchableOpacity>
              ); })}
            </>
          )}
        </Card>
      )}

      {/* ── Provision Panel (Credentials) ───────────────── */}
      {panelMode === "provision" && bleTargetDevice && !isBleProvisioning && (
        <Card style={styles.panel}>
          <View style={styles.provisionHeader}>
            <View style={[styles.iconBox, { backgroundColor: `${theme.colors.accent.primary}20` }]}>
              <Feather name="cpu" size={16} color={theme.colors.accent.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="body-md" style={styles.bleDeviceName}>{bleTargetDevice.name}</Text>
              <Text variant="meta-sm" style={styles.mutedText}>Enter Wi-Fi to connect</Text>
            </View>
          </View>

          {wifiNetworks.length === 0 && !isScanningWifi && (
            <Button variant="outline" onPress={handleScanWifi} style={{marginTop: 16, marginBottom: 8}}>
              Scan Wi-Fi via UNO Q
            </Button>
          )}

          {isScanningWifi && (
            <View style={[styles.scanningRow, {marginTop: 16, marginBottom: 8}]}>
              <ActivityIndicator size="small" color={theme.colors.accent.primary} />
              <Text variant="meta-sm" style={styles.mutedText}>
                Scanning networks...
              </Text>
            </View>
          )}

          {wifiNetworks.length > 0 && (
            <View style={{marginTop: 16, marginBottom: 8}}>
              <Text variant="label-sm" style={[styles.mutedText, { marginBottom: 8 }]}>
                {wifiNetworks.length} NETWORKS FOUND
              </Text>
              <View style={{backgroundColor: theme.colors.background.secondary, borderRadius: 8, padding: 8}}>
                {wifiNetworks.map((net, i) => {
                  let signalIcon = "wifi-off";
                  if (net.rssi > -60) signalIcon = "wifi";
                  else if (net.rssi > -80) signalIcon = "wifi";
                  else signalIcon = "wifi";

                  return (
                    <TouchableOpacity
                      key={net.ssid}
                      style={[
                        styles.bleDeviceRow, 
                        { backgroundColor: "transparent", borderBottomWidth: i === wifiNetworks.length - 1 ? 0 : StyleSheet.hairlineWidth }
                      ]}
                      onPress={() => setWifiSsid(net.ssid)}
                    >
                      <View style={styles.bleDeviceInfo}>
                        <Feather name={signalIcon as any} size={16} color={theme.colors.text.muted} />
                        <View>
                          <Text variant="body-md" style={styles.bleDeviceName}>{net.ssid}</Text>
                          <Text variant="meta-sm" style={styles.mutedText}>
                            {net.rssi} dBm
                          </Text>
                        </View>
                      </View>
                      {net.secure && <Feather name="lock" size={14} color={theme.colors.text.muted} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          <Text variant="label-sm" style={[styles.panelHint, { marginTop: 12 }]}>NETWORK NAME (SSID)</Text>
          <TextInput
            style={styles.credInput}
            value={wifiSsid}
            onChangeText={setWifiSsid}
            placeholder="MyHomeWiFi"
            placeholderTextColor={theme.colors.text.muted}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text variant="label-sm" style={styles.panelHint}>PASSWORD</Text>
          <TextInput
            style={styles.credInput}
            value={wifiPass}
            onChangeText={setWifiPass}
            placeholder="••••••••"
            placeholderTextColor={theme.colors.text.muted}
            secureTextEntry
          />

          <View style={styles.actionRow}>
            <Button variant="outline" onPress={handleResetBle} style={styles.actionBtn}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onPress={handleProvision}
              disabled={!wifiSsid.trim() || !wifiPass.trim()}
              style={styles.actionBtn}
            >
              Provision
            </Button>
          </View>
        </Card>
      )}

      {/* ── BLE Provisioning In-Progress ────────────────── */}
      {isBleProvisioning && (
        <Card style={styles.panel}>
          <View style={styles.progressRow}>
            <ActivityIndicator color={theme.colors.accent.primary} />
            <View style={{ flex: 1 }}>
              <Text variant="body-md" style={styles.bleDeviceName}>
                {provisionStatusLabel[bleStatus] ?? "Working…"}
              </Text>
              <Text variant="meta-sm" style={styles.mutedText}>
                Do not close the app
              </Text>
            </View>
          </View>
        </Card>
      )}

      {/* ── BLE Error ───────────────────────────────────── */}
      {bleStatus === "error" && bleError && (
        <Card style={styles.panel}>
          <View style={styles.errorBanner}>
            <Feather name="alert-circle" size={16} color={theme.colors.semantic.error} />
            <Text variant="meta-sm" style={styles.errorText}>{bleError}</Text>
          </View>
          <Button variant="outline" onPress={handleResetBle} style={{ marginTop: 12 }}>
            Try Again
          </Button>
        </Card>
      )}

    </Screen>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 56,
  },

  // Header
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  pageTitle: {
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.secondary,
    alignItems: "center",
    justifyContent: "center",
  },

  // Device meta row
  metaRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    marginBottom: 24,
  },
  metaChip: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 3,
  },
  metaLabel: {
    color: theme.colors.text.muted,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  metaValue: {
    color: theme.colors.text.primary,
    fontSize: 13,
  },

  // Sensor grid
  sensorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },

  // Actions
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
  },

  // Error banner
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: `${theme.colors.semantic.error}12`,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: theme.colors.semantic.error,
    flex: 1,
    lineHeight: 18,
  },

  // Toggle row
  toggleRow: {
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: theme.colors.background.secondary,
    padding: 4,
    marginBottom: 12,
    gap: 4,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: theme.colors.background.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleLabel: {
    fontSize: 11,
    color: theme.colors.text.muted,
  },
  toggleLabelActive: {
    color: theme.colors.text.primary,
  },

  // Panel (shared card style)
  panel: {
    padding: 16,
    marginBottom: 16,
  },
  panelHint: {
    color: theme.colors.text.muted,
    marginBottom: 12,
    lineHeight: 20,
  },

  // Wi-Fi panel
  ipRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginBottom: 4,
  },
  ipInput: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.accent.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.secondary,
    fontSize: 15,
    fontFamily: "System",
  },
  connectBtn: {
    minWidth: 110,
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.accent.border,
  },
  suggestionInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  suggestionIp: {
    color: theme.colors.text.primary,
    fontSize: 13,
  },
  mutedText: {
    color: theme.colors.text.muted,
    fontSize: 12,
  },

  // BLE panel
  scanBtn: {
    marginBottom: 12,
  },
  scanningRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    justifyContent: "center",
  },
  bleDeviceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.accent.border,
  },
  bleDeviceInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: `${theme.colors.accent.primary}18`,
    alignItems: "center",
    justifyContent: "center",
  },
  bleDeviceName: {
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  selectChip: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  selectChipText: {
    color: theme.colors.text.primary,
    fontSize: 10,
  },

  // Provision panel
  provisionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  credInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.accent.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.secondary,
    fontSize: 15,
    fontFamily: "System",
    marginBottom: 12,
  },

  // Progress
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 4,
  },
});
