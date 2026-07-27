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
} from "../../../src/design-system";
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

      {/* 1. Welcoming Greeting Header */}
      <View style={styles.headerContainer} testID="welcome-header">
        <Text variant="display-lg" style={styles.greeting}>
          Good Morning
        </Text>
        <Text variant="body-md" style={styles.prompt}>
          What's on your mind?
        </Text>
      </View>

      {/* 2. Quick Actions */}
      <SectionHeader title="Quick Actions" />
      <View style={styles.actionsRow} testID="quick-actions">
        {quickActions.map(action => (
          <Button
            key={action.id}
            variant="outline"
            onPress={() => {
              if (action.id === "new-capture") {
                router.push("/(modals)/new-capture" as any);
              } else {
                router.push(action.route as any);
              }
            }}
            accessibilityLabel={action.accessibilityLabel}
            style={styles.actionButton}
          >
            {action.label}
          </Button>
        ))}
      </View>

      {/* 3. Continue Previous Capture */}
      <SectionHeader title="Continuing Anchor" />
      <View testID="continuing-anchor">
        <Card variant="outlined" style={styles.anchorCard}>
          <View style={styles.anchorHeader}>
            <Tag label="unfinished" variant="warning" />
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

      {/* 4. Hardware Status */}
      <SectionHeader title="Hardware Status" />
      <View style={styles.statusSection} testID="device-status">
        {isOffline && (
          <EmptyState
            variant="devices"
            title="Device Offline"
            message="Connect to your VAHA device over local WiFi to sync captures."
          />
        )}
        {!isOffline && (
          <>
            <DeviceCard
              name="Arduino Uno Q"
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
                unit="items"
                status="normal"
              />
            </View>
          </>
        )}
      </View>

      {/* 5. Daily Insights Preview */}
      <SectionHeader title="Suggested Reflection" />
      <View testID="suggested-reflection">
        <InsightCard
          quote="Truth is local. A thought exists in context and stillness. Let the ledger accumulate without pressure."
          sourceTitle="Vaha Reflection Engine"
          timestamp="Today"
        />
      </View>

      {/* 6. Recent Timeline — live data from SQLite */}
      <SectionHeader title="Recent Timeline" />
      <View style={styles.timelineList} testID="recent-timeline">
        {captures.length === 0 ? (
          <EmptyState
            variant="captures"
            title="No captures yet"
            message="Voice notes you record on your VAHA device will appear here."
          />
        ) : (
          captures.map(capture => (
            <ListItem
              key={capture.id}
              title={capture.transcript ?? capture.title ?? "Untitled Capture"}
              subtitle={
                capture.createdAt
                  ? new Date(capture.createdAt).toLocaleString()
                  : "Unknown time"
              }
              rightElement={
                <Tag
                  label={capture.syncState === "synced" ? "synced" : "pending"}
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
