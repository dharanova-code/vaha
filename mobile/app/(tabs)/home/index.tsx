import React, { useEffect } from "react";
import { StyleSheet, View, ScrollView, RefreshControl } from "react-native";
import { router } from "expo-router";
import {
  Screen,
  Text,
  Card,
  Tag,
  Button,
  SectionHeader,
  ListItem,
  DeviceCard,
  SensorCard,
  EmptyState,
  Avatar,
  theme,
} from "../../../src/design-system";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useHomeData } from "../../../src/features/home/hooks/useHomeData";
import { useSettingsStore } from "../../../src/features/settings/stores/settingsStore";

function getDynamicGreeting(name?: string): { greeting: string; prompt: string } {
  const hour = new Date().getHours();
  let timeOfDay = "Morning";
  let prompt = "What's on your mind?";

  if (hour >= 4 && hour < 12) {
    timeOfDay = "Morning";
    prompt = "Ready to record your thoughts today?";
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = "Afternoon";
    prompt = "How is your afternoon going?";
  } else if (hour >= 17 && hour < 22) {
    timeOfDay = "Evening";
    prompt = "Reflect on your day's ideas...";
  } else {
    timeOfDay = "Night";
    prompt = "Late night thoughts & voice memos...";
  }

  const firstName = name?.trim() ? `, ${name.trim().split(" ")[0]}` : "";
  return {
    greeting: `Good ${timeOfDay}${firstName}`,
    prompt,
  };
}

export default function HomeScreen() {
  const {
    connectionStatus,
    isOffline,
    deviceStatus,
    temperature,
    captures,
    todayCount,
    isLoading,
    isSyncing,
    onRefresh,
  } = useHomeData();

  const { userName, userAvatarUri, loadSettings } = useSettingsStore();
  const { greeting, prompt } = getDynamicGreeting(userName);

  // Load and refresh settings to ensure avatar & profile update immediately
  useEffect(() => {
    loadSettings();
    onRefresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sort captures descending by creation date (newest first) and limit to exactly 5 notes
  const sortedRecentCaptures = [...captures]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <Screen
      scrollable
      withMarginThread
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading || isSyncing} onRefresh={onRefresh} tintColor={theme.colors.accent.primary} />
      }
    >
      {/* 1. Welcoming Dynamic Greeting Header with Settings/Profile Trigger */}
      <View style={styles.headerContainer} testID="welcome-header">
        <View style={styles.headerRow}>
          <View style={styles.headerTextCol}>
            <Text variant="display-lg" style={styles.greeting}>
              {greeting}
            </Text>
            <Text variant="body-md" style={styles.prompt}>
              {prompt}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/(tabs)/settings" as any)}
            accessibilityLabel="Open settings and profile"
          >
            <Avatar initials={userName || "Vaha"} imageUri={userAvatarUri || null} size={44} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Sleek Voice Workspace Summary (Replaces Unfinished Note) */}
      <SectionHeader title="Voice Library Status" />
      <View style={{ marginBottom: 24 }}>
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCol}>
              <Text variant="headline-lg" style={styles.summaryMetric}>
                {captures.length}
              </Text>
              <Text variant="meta-sm" style={styles.summaryLabel}>
                Total Notes
              </Text>
            </View>
            
            <View style={styles.summaryDivider} />
            
            <View style={styles.summaryCol}>
              <Text variant="headline-lg" style={styles.summaryMetric}>
                {todayCount}
              </Text>
              <Text variant="meta-sm" style={styles.summaryLabel}>
                Today
              </Text>
            </View>
            
            <View style={styles.summaryDivider} />
            
            <View style={styles.summaryCol}>
              <Feather name="check-circle" size={24} color={theme.colors.semantic.success} style={{ marginBottom: 4 }} />
              <Text variant="meta-sm" style={[styles.summaryLabel, { fontWeight: "700", color: theme.colors.semantic.success }]}>
                Fully Synced
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* 3. Device Connection Status */}
      <SectionHeader title="Device Connection" />
      <View style={styles.statusSection} testID="device-status">
        {isOffline && (
          <EmptyState
            variant="devices"
            title="Device Disconnected"
            message="Connect your Vaha device to your Wi-Fi network to get your voice notes."
          />
        )}
        {!isOffline && (
          <>
            <DeviceCard
              name="Vaha Device"
              status={connectionStatus === "connected" ? "connected" : "disconnected"}
              batteryLevel={deviceStatus?.battery_percentage ?? 100}
            />
            <View style={styles.sensorRow}>
              <SensorCard
                label="TEMP"
                value={temperature != null ? temperature.toFixed(1) : "--"}
                unit="°C"
                status="normal"
              />
              <SensorCard
                label="TODAY LOGS"
                value={String(todayCount)}
                unit="notes"
                status="normal"
              />
            </View>
          </>
        )}
      </View>

      {/* 4. Recent Voice Notes (Max 5, sorted newest first) */}
      <SectionHeader title="Recent Voice Notes" />
      <View style={styles.timelineList} testID="recent-timeline">
        {sortedRecentCaptures.length === 0 ? (
          <EmptyState
            variant="captures"
            title="No voice notes yet"
            message="Notes you record on your Vaha device will automatically show up here."
          />
        ) : (
          sortedRecentCaptures.map(capture => (
            <ListItem
              key={capture.id}
              title={capture.title ?? capture.transcript?.substring(0, 45) ?? "Voice Note"}
              subtitle={
                capture.createdAt
                  ? new Date(capture.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " - " + new Date(capture.createdAt).toLocaleDateString()
                  : "Unknown time"
              }
              rightElement={
                <Tag
                  label={capture.syncState === "synced" ? "saved" : "syncing"}
                  variant={capture.syncState === "synced" ? "success" : "warning"}
                />
              }
              onPress={() => {
                router.push({ pathname: "/(modals)/capture-details", params: { uuid: capture.uuid } });
              }}
            />
          ))
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingBottom: 48,
  },
  headerContainer: {
    marginBottom: 32,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTextCol: {
    flex: 1,
    paddingRight: 16,
  },
  profileButton: {
    padding: 2,
  },
  greeting: {
    marginBottom: 8,
  },
  prompt: {
    fontStyle: "italic",
    opacity: 0.8,
  },
  statusSection: {
    marginBottom: 24,
  },
  sensorRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  summaryCard: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.accent.border,
    borderRadius: 16,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryMetric: {
    color: theme.colors.text.primary,
    fontWeight: "800",
    marginBottom: 4,
  },
  summaryLabel: {
    color: theme.colors.text.muted,
    fontSize: 12,
  },
  summaryDivider: {
    width: StyleSheet.hairlineWidth,
    height: 36,
    backgroundColor: theme.colors.accent.border,
  },
  timelineList: {
    marginBottom: 24,
    gap: 8,
  },
});
