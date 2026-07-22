import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Screen,
  Text,
  Button,
  SectionHeader,
  DeviceCard,
  SensorCard,
  Card,
  Input,
  EmptyState,
} from "../../../src/design-system";
import { useDeviceData } from "../../../src/features/devices/hooks/useDeviceData";
import { theme } from "../../../src/design-system";
import { router } from "expo-router";

export default function DeviceScreen() {
  const {
    isConnected,
    isConnecting,
    isError,
    lastError,
    connectLabel,
    ipInput,
    setIpInput,
    deviceStatus,
    uptimeLabel,
    liveSensors,
    vocStatus,
    isSyncing,
    syncLabel,
    handleConnectToggle,
    handleSync,
    handleRefreshStatus,
  } = useDeviceData();

  return (
    <Screen scrollable withMarginThread style={styles.container}>

      {/* Connection Panel */}
      <SectionHeader title="Connection" />
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.inputWrapper}>
            <Input
              value={ipInput}
              onChangeText={setIpInput}
              placeholder="192.168.x.x"
              autoCapitalize="none"
              keyboardType="numeric"
              editable={!isConnected}
              accessibilityLabel="Device IP address"
            />
          </View>
          <Button
            variant={isConnected ? "outline" : "primary"}
            onPress={handleConnectToggle}
            disabled={isConnecting}
            style={styles.connectButton}
            accessibilityLabel={connectLabel}
          >
            {connectLabel}
          </Button>
        </View>

        {/* Error state */}
        {isError && lastError && (
          <Text variant="body-md" style={styles.errorText}>
            {lastError}
          </Text>
        )}
      </Card>

      {/* Offline empty state */}
      {!isConnected && !isError && (
        <View>
          <EmptyState
            variant="devices"
            title="Not Connected"
            message="Enter your device IP address and press Connect to begin."
          />
          <Button
            variant="primary"
            onPress={() => router.push("/(tabs)/device/provision" as any)}
            style={{ marginHorizontal: 16, marginTop: 16 }}
          >
            Provision New Device
          </Button>
        </View>
      )}

      {/* Connected content */}
      {isConnected && deviceStatus && (
        <>
          {/* Status */}
          <SectionHeader title="Status" />
          <View style={styles.cardContainer}>
            <DeviceCard
              name="Arduino Uno Q"
              status="connected"
              batteryLevel={deviceStatus.battery_percentage ?? 100}
            />
            <View style={styles.statsRow}>
              <Text variant="label-sm" style={styles.statLabel}>
                FIRMWARE{" "}
                <Text variant="body-md">{deviceStatus.firmware_version}</Text>
              </Text>
              <Text variant="label-sm" style={styles.statLabel}>
                UPTIME <Text variant="body-md">{uptimeLabel}</Text>
              </Text>
              <Text variant="label-sm" style={styles.statLabel}>
                BUFFERED{" "}
                <Text variant="body-md">{deviceStatus.buffered_captures_count}</Text>
              </Text>
            </View>
          </View>

          {/* Live Sensors */}
          <SectionHeader title="Live Sensors" />
          <View style={styles.sensorGrid}>
            <SensorCard
              label="TEMPERATURE"
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

          {/* Actions */}
          <SectionHeader title="Actions" />
          <View style={styles.actionsGrid}>
            <Button
              variant="primary"
              onPress={handleSync}
              disabled={isSyncing}
              style={styles.actionButton}
              accessibilityLabel={syncLabel}
            >
              {syncLabel}
            </Button>
            <Button
              variant="outline"
              onPress={handleRefreshStatus}
              style={styles.actionButton}
              accessibilityLabel="Refresh device status"
            >
              Refresh Status
            </Button>
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingBottom: 48,
  },
  card: {
    padding: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  inputWrapper: {
    flex: 1,
  },
  connectButton: {
    minWidth: 100,
  },
  errorText: {
    color: theme.colors.semantic.error,
    marginTop: 8,
  },
  cardContainer: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal: 4,
  },
  statLabel: {
    color: theme.colors.text.muted,
  },
  sensorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
  },
});
