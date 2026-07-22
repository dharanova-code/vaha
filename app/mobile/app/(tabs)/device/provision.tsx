import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import {
  Screen,
  Text,
  Button,
  SectionHeader,
  Card,
  Input,
  theme,
} from "../../../src/design-system";
import { useBleProvisioning } from "../../../src/features/devices/hooks/useBleProvisioning";
import { DiscoveredBleDevice } from "../../../src/features/devices/services/BleProvisioningService";

export default function ProvisionScreen() {
  const {
    status,
    devices,
    lastError,
    startScanning,
    stopScanning,
    provisionDevice,
    reset,
  } = useBleProvisioning();

  const [step, setStep] = useState<"scan" | "credentials">("scan");
  const [targetDevice, setTargetDevice] = useState<DiscoveredBleDevice | null>(null);
  const [ssid, setSsid] = useState("");
  const [pass, setPass] = useState("");

  const handleScan = () => {
    startScanning();
  };

  const handleStopScan = () => {
    stopScanning();
  };

  const handleSelectDevice = (device: DiscoveredBleDevice) => {
    stopScanning();
    setTargetDevice(device);
    setStep("credentials");
  };

  const handleProvision = () => {
    if (targetDevice && ssid.trim() && pass.trim()) {
      provisionDevice(targetDevice, ssid.trim(), pass.trim());
    }
  };

  const handleReset = () => {
    reset();
    setStep("scan");
    setTargetDevice(null);
  };

  if (status === "success") {
    return (
      <Screen scrollable withMarginThread style={styles.container}>
        <View style={styles.center}>
          <Text variant="headline-lg">Provisioning Successful!</Text>
          <Text variant="body-md" style={styles.subtitle}>
            Your device is now connected to Wi-Fi.
          </Text>
          <Button
            variant="primary"
            onPress={() => router.replace("/(tabs)/device")}
          >
            Go to Device
          </Button>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollable withMarginThread style={styles.container}>
      <SectionHeader title="Provision New Device" />
      
      {/* Error State */}
      {lastError && (
        <Card style={styles.errorCard}>
          <Text variant="label-sm" style={styles.errorLabel}>ERROR</Text>
          <Text variant="body-md" style={styles.errorText}>{lastError}</Text>
          <Button variant="outline" onPress={handleReset} style={{ marginTop: 12 }}>
            Try Again
          </Button>
        </Card>
      )}

      {/* Discovery Phase */}
      {step === "scan" && (
        <Card style={styles.card}>
          <Text variant="body-md" style={{ marginBottom: 16 }}>
            Make sure your VAHA device is turned on and blinking blue (setup mode).
          </Text>
          
          {status === "scanning" ? (
            <Button variant="outline" onPress={handleStopScan}>
              Stop Scanning
            </Button>
          ) : (
            <Button variant="primary" onPress={handleScan}>
              Scan for Devices
            </Button>
          )}

          {devices.length > 0 && (
            <View style={styles.deviceList}>
              {devices.map((device) => (
                <View key={device.id} style={styles.deviceItem}>
                  <View>
                    <Text variant="body-md" style={{ fontWeight: "bold" }}>{device.name}</Text>
                    <Text variant="label-sm">RSSI: {device.rssi}</Text>
                  </View>
                  <Button 
                    variant="outline" 
                    onPress={() => handleSelectDevice(device)}
                  >
                    Select
                  </Button>
                </View>
              ))}
            </View>
          )}
        </Card>
      )}

      {/* Credentials Phase */}
      {step === "credentials" && (
        <Card style={styles.card}>
          <Text variant="headline-lg" style={{ marginBottom: 8 }}>
            Connect to Wi-Fi
          </Text>
          <Text variant="body-md" style={{ marginBottom: 16 }}>
            Enter the Wi-Fi network details for {targetDevice?.name} to connect to.
          </Text>

          <View style={styles.inputWrapper}>
            <Text variant="label-sm">Network Name (SSID)</Text>
            <Input
              value={ssid}
              onChangeText={setSsid}
              placeholder="MyWiFiNetwork"
              autoCapitalize="none"
              editable={status === "idle"}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text variant="label-sm">Password</Text>
            <Input
              value={pass}
              onChangeText={setPass}
              placeholder="••••••••"
              secureTextEntry
              editable={status === "idle"}
            />
          </View>

          <View style={styles.actionsGrid}>
            <Button
              variant="outline"
              onPress={handleReset}
              disabled={status !== "idle"}
              style={styles.actionButton}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onPress={handleProvision}
              disabled={!ssid.trim() || !pass.trim() || status !== "idle"}
              style={styles.actionButton}
            >
              {status === "idle" ? "Provision" : status.replace(/_/g, " ").toUpperCase()}
            </Button>
          </View>
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingBottom: 48,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 48,
  },
  subtitle: {
    color: theme.colors.text.muted,
    marginVertical: 16,
    textAlign: "center",
  },
  card: {
    padding: 16,
    marginBottom: 24,
  },
  errorCard: {
    padding: 16,
    marginBottom: 24,
    backgroundColor: "#FFF5F5",
    borderColor: theme.colors.semantic.error,
  },
  errorLabel: {
    color: theme.colors.semantic.error,
    fontWeight: "bold",
    marginBottom: 4,
  },
  errorText: {
    color: theme.colors.text.muted,
  },
  deviceList: {
    marginTop: 24,
    gap: 12,
  },
  deviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(122, 114, 101, 0.15)",
    borderRadius: 8,
  },
  inputWrapper: {
    marginBottom: 16,
    gap: 4,
  },
  actionsGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
});
