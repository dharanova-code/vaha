import React from "react";
import { StyleSheet, View, Switch } from "react-native";
import {
  Screen,
  Text,
  SectionHeader,
  Card,
  theme,
  SettingsItem,
} from "../../../src/design-system";
import { useSettingsData } from "../../../src/features/settings/hooks/useSettingsData";

export default function SettingsScreen() {
  const { autoSync, handleToggleAutoSync, retentionDays, handleCycleRetention } = useSettingsData();

  const getRetentionText = (days: number) => {
    if (days === 0) return "Forever";
    return `${days} Days`;
  };

  return (
    <Screen scrollable withMarginThread style={styles.container}>
      <SectionHeader title="Preferences" />

      <Card style={styles.card}>
        <View style={styles.row}>
          <Text variant="body-md" style={styles.label}>
            Auto-Sync on Connect
          </Text>
          <Switch
            value={autoSync}
            onValueChange={handleToggleAutoSync}
            trackColor={{
              false: theme.colors.accent.border,
              true: theme.colors.text.primary,
            }}
          />
        </View>
        <SettingsItem
          label="Privacy Retention Timer"
          value={getRetentionText(retentionDays)}
          onPress={handleCycleRetention}
        />
      </Card>

      <SectionHeader title="About" />
      <Card style={styles.card}>
        <View style={styles.row}>
          <Text variant="body-md" style={styles.label}>
            App Version
          </Text>
          <Text variant="body-md" style={styles.value}>
            1.0.0 (Phase E)
          </Text>
        </View>
      </Card>
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: theme.colors.text.primary,
  },
  value: {
    color: theme.colors.text.muted,
  },
});
