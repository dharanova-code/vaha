import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Screen,
  SectionHeader,
  InsightCard,
  SensorCard,
  EmptyState,
  Loading,
} from "../../../src/design-system";
import { useInsightsData } from "../../../src/features/insights/hooks/useInsightsData";

export default function InsightsScreen() {
  const {
    isLoading,
    isEmpty,
    totalCaptures,
    totalDuration,
  } = useInsightsData();

  return (
    <Screen scrollable withMarginThread style={styles.container}>
      {isLoading && <Loading />}

      {!isLoading && isEmpty && (
        <EmptyState
          variant="insights"
          title="No insights yet"
          message="Capture some voice notes to start seeing trends and AI insights here."
        />
      )}

      {!isLoading && !isEmpty && (
        <>
          <SectionHeader title="Activity Summary" />

          <View style={styles.statsGrid}>
            <SensorCard
              label="TOTAL CAPTURES"
              value={totalCaptures.toString()}
              unit=""
              status="normal"
            />
            <SensorCard
              label="TOTAL DURATION"
              value={Math.round(totalDuration).toString()}
              unit="sec"
              status="normal"
            />
          </View>

          <SectionHeader title="Trends" />
          <View style={styles.insights}>
            <InsightCard
              quote="No AI insights generated yet. Build up your library."
              sourceTitle="System"
              timestamp="Today"
            />
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
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  insights: {
    marginBottom: 24,
  },
});
