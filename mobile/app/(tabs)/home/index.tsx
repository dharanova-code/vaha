import React from "react";
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
  InsightCard,
  DeviceCard,
  SensorCard,
  EmptyState,
  Avatar,
} from "../../../src/design-system";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useHomeData } from "../../../src/features/home/hooks/useHomeData";
import { quickActions } from "../../../src/features/home/mock/quickActions";
import { continuingAnchor } from "../../../src/features/home/mock/recentCaptures";

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

  return (
    <Screen
      scrollable
      withMarginThread
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading || isSyncing} onRefresh={onRefresh} />
      }
    >

      {/* 1. Welcoming Greeting Header with Top Right Settings & Profile Trigger */}
      <View style={styles.headerContainer} testID="welcome-header">
        <View style={styles.headerRow}>
          <View style={styles.headerTextCol}>
            <Text variant="display-lg" style={styles.greeting}>
              Good Morning
            </Text>
            <Text variant="body-md" style={styles.prompt}>
              What's on your mind?
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/(tabs)/settings" as any)}
            accessibilityLabel="Open settings and profile"
          >
            <Avatar initials="VA" size={40} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Unfinished Note */}
      <SectionHeader title="Unfinished Note" />
      <View testID="continuing-anchor">
        <Card variant="outlined" style={styles.anchorCard}>
          <View style={styles.anchorHeader}>
            <Tag label="draft" variant="warning" />
            <Text variant="mono-bold" style={styles.anchorTime}>
              {continuingAnchor.timestamp}
            </Text>
          </View>
          <Text variant="headline-lg" style={styles.anchorTitle}>
            {continuingAnchor.title}
          </Text>
          <Text variant="body-md" style={styles.anchorExcerpt}>
            {continuingAnchor.excerpt}
          </Text>
        </Card>
      </View>

      {/* 3. Device Connection */}
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

      {/* 4. Daily Inspiration */}
      <SectionHeader title="Daily Inspiration" />
      <View testID="suggested-reflection">
        <InsightCard
          quote="Simple ideas recorded clearly are the start of great things. Speak freely."
          sourceTitle="Vaha Voice Notes"
          timestamp="Today"
        />
      </View>

      {/* 5. Recent Voice Notes */}
      <SectionHeader title="Recent Voice Notes" />
      <View style={styles.timelineList} testID="recent-timeline">
        {captures.length === 0 ? (
          <EmptyState
            variant="captures"
            title="No voice notes yet"
            message="Notes you record on your Vaha device will automatically show up here."
          />
        ) : (
          captures.map(capture => (
            <ListItem
              key={capture.id}
              title={capture.transcript ?? capture.title ?? "Untitled Note"}
              subtitle={
                capture.createdAt
                  ? new Date(capture.createdAt).toLocaleString()
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
  anchorCard: {
    marginBottom: 24,
    padding: 16,
  },
  anchorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  anchorTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  anchorTitle: {
    marginBottom: 8,
  },
  anchorExcerpt: {
    opacity: 0.7,
    lineHeight: 22,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    minWidth: 100,
  },
  timelineList: {
    marginBottom: 24,
  },
});
