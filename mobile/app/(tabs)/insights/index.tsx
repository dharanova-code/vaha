import React, { useState, useMemo } from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions } from "react-native";
import Svg, { Path, Line, Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import {
  Screen,
  SectionHeader,
  Text,
  Card,
  colors,
  spacing,
  radius,
  Icon,
} from "../../../src/design-system";
import { useInsightsData } from "../../../src/features/insights/hooks/useInsightsData";
import { DailySensorLog } from "../../../src/features/insights/mock/mockSensorData";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CONTAINER_PADDING = 24;
const CHART_WIDTH = SCREEN_WIDTH - (CONTAINER_PADDING * 2) - 40; // width subtracting screen padding and y-axis labels
const CHART_HEIGHT = 160;

interface Point {
  x: number;
  y: number;
}

export default function InsightsScreen() {
  const {
    totalCaptures,
    totalDuration,
    sensorLogs,
    telemetryInsights,
  } = useInsightsData();

  const [timeRange, setTimeRange] = useState<7 | 30 | 45>(7);
  const [envTab, setEnvTab] = useState<"temp_hum" | "tvoc">("temp_hum");
  const [mode, setMode] = useState<"ai" | "kids">("ai");

  // Filter sensor logs based on selected range
  const filteredLogs = useMemo(() => {
    return sensorLogs.slice(-timeRange);
  }, [sensorLogs, timeRange]);

  const lastLog = useMemo<DailySensorLog>(() => {
    return filteredLogs[filteredLogs.length - 1] || {
      date: "",
      waterConsumedLiters: 0,
      averageTemperature: 0,
      averageHumidity: 0,
      averageTVOC: 0,
      isAnomaly: false,
      anomalyReason: "",
    };
  }, [filteredLogs]);

  // Today's stats compared to average
  const isHighWater = telemetryInsights.waterDeviationPercentage > 30;

  // Max and min calculation for Y-Axis labels in Water chart
  const waterBounds = useMemo(() => {
    if (filteredLogs.length === 0) return { min: 0, max: 200, range: 200 };
    const values = filteredLogs.map((log) => log.waterConsumedLiters);
    const min = Math.min(...values) * 0.9;
    const max = Math.max(...values) * 1.1;
    return { min, max, range: max - min || 1 };
  }, [filteredLogs]);

  // Water Chart points and path helper
  const waterChart = useMemo(() => {
    if (filteredLogs.length === 0) return { linePath: "", areaPath: "", points: [] };

    const { min, range } = waterBounds;
    const points = filteredLogs.map((log, index) => {
      const x = (index / (filteredLogs.length - 1)) * CHART_WIDTH;
      const y = CHART_HEIGHT - ((log.waterConsumedLiters - min) / range) * (CHART_HEIGHT - 40) - 20;
      return { x, y };
    });

    let linePath = `M ${points[0]!.x} ${points[0]!.y}`;
    for (let i = 1; i < points.length; i++) {
      linePath += ` L ${points[i]!.x} ${points[i]!.y}`;
    }

    const areaPath = `${linePath} L ${points[points.length - 1]!.x} ${CHART_HEIGHT} L ${points[0]!.x} ${CHART_HEIGHT} Z`;

    return { linePath, areaPath, points };
  }, [filteredLogs, waterBounds]);

  // Environmental bounds (Temp/Hum/TVOC)
  const envBounds = useMemo(() => {
    if (filteredLogs.length === 0) return { min1: 0, max1: 100, min2: 0, max2: 100 };
    
    if (envTab === "temp_hum") {
      const temps = filteredLogs.map((log) => log.averageTemperature);
      const hums = filteredLogs.map((log) => log.averageHumidity);
      return {
        min1: Math.min(...temps) * 0.9,
        max1: Math.max(...temps) * 1.1,
        min2: Math.min(...hums) * 0.9,
        max2: Math.max(...hums) * 1.1,
      };
    } else {
      const tvocs = filteredLogs.map((log) => log.averageTVOC);
      return {
        min1: Math.min(...tvocs) * 0.9,
        max1: Math.max(...tvocs) * 1.1,
      };
    }
  }, [filteredLogs, envTab]);

  // Environmental Chart points and path helper
  const envChart = useMemo(() => {
    if (filteredLogs.length === 0) return { line1: "", line2: "", area1: "" };

    const { min1, max1, min2, max2 } = envBounds;
    const range1 = max1 - min1 || 1;

    if (envTab === "temp_hum" && min2 !== undefined && max2 !== undefined) {
      const range2 = max2 - min2 || 1;

      const points1 = filteredLogs.map((log, index) => {
        const x = (index / (filteredLogs.length - 1)) * CHART_WIDTH;
        const y = CHART_HEIGHT - ((log.averageTemperature - min1) / range1) * (CHART_HEIGHT - 40) - 20;
        return { x, y };
      });

      const points2 = filteredLogs.map((log, index) => {
        const x = (index / (filteredLogs.length - 1)) * CHART_WIDTH;
        const y = CHART_HEIGHT - ((log.averageHumidity - min2) / range2) * (CHART_HEIGHT - 40) - 20;
        return { x, y };
      });

      let line1 = `M ${points1[0]!.x} ${points1[0]!.y}`;
      let line2 = `M ${points2[0]!.x} ${points2[0]!.y}`;

      for (let i = 1; i < filteredLogs.length; i++) {
        line1 += ` L ${points1[i]!.x} ${points1[i]!.y}`;
        line2 += ` L ${points2[i]!.x} ${points2[i]!.y}`;
      }

      return { line1, line2 };
    } else {
      const points1 = filteredLogs.map((log, index) => {
        const x = (index / (filteredLogs.length - 1)) * CHART_WIDTH;
        const y = CHART_HEIGHT - ((log.averageTVOC - min1) / range1) * (CHART_HEIGHT - 40) - 20;
        return { x, y };
      });

      let line1 = `M ${points1[0]!.x} ${points1[0]!.y}`;
      for (let i = 1; i < filteredLogs.length; i++) {
        line1 += ` L ${points1[i]!.x} ${points1[i]!.y}`;
      }

      const area1 = `${line1} L ${points1[points1.length - 1]!.x} ${CHART_HEIGHT} L ${points1[0]!.x} ${CHART_HEIGHT} Z`;

      return { line1, area1 };
    }
  }, [filteredLogs, envTab, envBounds]);

  // Kids Sustainability Story config
  const kidsStory = useMemo(() => {
    if (isHighWater) {
      return {
        title: "Oh No! A Big Splash Day! 🚨",
        message: `We used ${lastLog.waterConsumedLiters}L of water today—that's enough to fill 4 giant swimming pools! If we waste it, the little ducklings in the forest pond won't have enough water to swim, and the wise frogs will get thirsty. Let's make sure the taps are turned off tight! 🦆💚`,
        color: "#FEF3C7",
        borderColor: "#F59E0B",
        emoji: "🦆",
      };
    } else {
      return {
        title: "Yay! You Saved The Frogs! 🐸🎉",
        message: `Superstar! We used only ${lastLog.waterConsumedLiters}L of water today. Because you kept your water use low, the Blue Forest River is flowing happily, keeping 12 little frogs safe and cool! You are an environmental hero! 🐸💎`,
        color: "#ECFDF5",
        borderColor: "#10B981",
        emoji: "🐸",
      };
    }
  }, [isHighWater, lastLog]);

  return (
    <Screen scrollable style={styles.container}>
      {/* 1. Time Range Selector Header */}
      <View style={styles.rangeSelectorContainer}>
        <View style={styles.segmentedControl}>
          {([7, 30, 45] as const).map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.segmentButton,
                timeRange === range && styles.segmentButtonActive,
              ]}
              onPress={() => setTimeRange(range)}
            >
              <Text
                variant="label-sm"
                style={[
                  styles.segmentText,
                  timeRange === range && styles.segmentTextActive,
                ]}
              >
                {range} Days
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 2. Top Summary Widget Grid */}
      <View style={styles.statsGrid}>
        <Card style={styles.statsCard}>
          <Text variant="meta-sm" style={styles.statsCardLabel}>
            AVERAGE DAILY
          </Text>
          <View style={styles.statsCardValueRow}>
            <Text variant="headline-lg" style={styles.statsCardValue}>
              {telemetryInsights.averageWaterLiters}
            </Text>
            <Text variant="label-sm" style={styles.statsCardUnit}>
              L/day
            </Text>
          </View>
        </Card>

        <Card style={[styles.statsCard, isHighWater && styles.statsCardWarning]}>
          <Text variant="meta-sm" style={styles.statsCardLabel}>
            MAX CONSUMED
          </Text>
          <View style={styles.statsCardValueRow}>
            <Text
              variant="headline-lg"
              style={[
                styles.statsCardValue,
                isHighWater && { color: colors.semantic.warning },
              ]}
            >
              {telemetryInsights.maxWaterLiters}
            </Text>
            <Text variant="label-sm" style={styles.statsCardUnit}>
              L
            </Text>
          </View>
        </Card>
      </View>

      {/* 3. Sustainable Insights Mode Selector */}
      <View style={styles.modeContainer}>
        <TouchableOpacity
          style={[styles.modeTabButton, mode === "ai" && styles.modeTabButtonActive]}
          onPress={() => setMode("ai")}
        >
          <Icon
            name="activity"
            size={16}
            color={mode === "ai" ? "#FAF8F5" : colors.text.muted}
          />
          <Text
            variant="label-sm"
            style={[styles.modeTabText, mode === "ai" && styles.modeTabTextActive]}
          >
            AI Advisor
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeTabButton, mode === "kids" && styles.modeTabButtonActive]}
          onPress={() => setMode("kids")}
        >
          <Icon
            name="smile"
            size={16}
            color={mode === "kids" ? "#FAF8F5" : colors.text.muted}
          />
          <Text
            variant="label-sm"
            style={[styles.modeTabText, mode === "kids" && styles.modeTabTextActive]}
          >
            Kids Story Mode
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4. Advisor / Stories Detail Card */}
      {mode === "ai" ? (
        <Card
          style={[
            styles.advisorCard,
            isHighWater ? styles.advisorWarning : styles.advisorNormal,
          ]}
        >
          <View style={styles.advisorHeader}>
            <View
              style={[
                styles.iconBadge,
                isHighWater ? styles.badgeWarning : styles.badgeNormal,
              ]}
            >
              <Icon
                name={isHighWater ? "alert-circle" : "check-circle"}
                size={18}
                color={isHighWater ? colors.semantic.warning : colors.semantic.success}
              />
            </View>
            <Text variant="headline-lg" style={styles.advisorTitle}>
              {isHighWater ? "Abnormal Water Usage Detected" : "Water Flow Is Optimal"}
            </Text>
          </View>
          <Text variant="body-md" style={styles.advisorText}>
            {isHighWater
              ? `Daily consumption spiked to ${lastLog.waterConsumedLiters}L today—which is ${telemetryInsights.waterDeviationPercentage}% above your normal average of ${telemetryInsights.averageWaterLiters}L. Check for leaky bathroom valves or faucets.`
              : `Water consumption is stable. Today's usage of ${lastLog.waterConsumedLiters}L aligns perfectly with your average sustainability baseline.`}
          </Text>
        </Card>
      ) : (
        <View
          style={[
            styles.kidsStoryCard,
            { backgroundColor: kidsStory.color, borderColor: kidsStory.borderColor },
          ]}
        >
          <View style={styles.kidsStoryHeader}>
            <Text variant="headline-lg" style={styles.kidsStoryEmoji}>
              {kidsStory.emoji}
            </Text>
            <Text variant="headline-lg" style={styles.kidsStoryTitle}>
              {kidsStory.title}
            </Text>
          </View>
          <Text variant="body-md" style={styles.kidsStoryText}>
            {kidsStory.message}
          </Text>
        </View>
      )}

      {/* 5. Chart A: Water Consumption Trends */}
      <SectionHeader title="Water Consumption Trends" />
      <Card style={styles.chartCard}>
        <View style={styles.chartLabelRow}>
          <Text variant="label-sm" style={styles.chartSubLabel}>
            Daily Volume (Liters)
          </Text>
          <Text variant="label-sm" style={styles.chartPeakLabel}>
            Peak Today: {lastLog.waterConsumedLiters}L
          </Text>
        </View>

        <View style={styles.chartWrapper}>
          {/* Y Axis Labels */}
          <View style={styles.yAxisLabels}>
            <Text variant="meta-sm" style={styles.yAxisText}>
              {Math.round(waterBounds.max)}L
            </Text>
            <Text variant="meta-sm" style={styles.yAxisText}>
              {Math.round((waterBounds.max + waterBounds.min) / 2)}L
            </Text>
            <Text variant="meta-sm" style={styles.yAxisText}>
              {Math.round(waterBounds.min)}L
            </Text>
          </View>

          {/* SVG Canvas */}
          {waterChart.linePath ? (
            <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
              <Defs>
                <LinearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={colors.accent.primary} stopOpacity={0.35} />
                  <Stop offset="100%" stopColor={colors.accent.primary} stopOpacity={0.0} />
                </LinearGradient>
              </Defs>

              {/* Grid Lines */}
              <Line x1="0" y1="20" x2={CHART_WIDTH} y2="20" stroke={colors.accent.border} strokeWidth="1" strokeDasharray="3 3" />
              <Line x1="0" y1={CHART_HEIGHT / 2} x2={CHART_WIDTH} y2={CHART_HEIGHT / 2} stroke={colors.accent.border} strokeWidth="1" strokeDasharray="3 3" />
              <Line x1="0" y1={CHART_HEIGHT - 20} x2={CHART_WIDTH} y2={CHART_HEIGHT - 20} stroke={colors.accent.border} strokeWidth="1" />

              {/* Area path */}
              <Path d={waterChart.areaPath} fill="url(#waterGrad)" />

              {/* Main Line path */}
              <Path d={waterChart.linePath} fill="none" stroke={colors.accent.primary} strokeWidth="2.5" />

              {/* Anomaly Highlight Circles */}
              {waterChart.points && filteredLogs.map((log, index) => {
                if (log.isAnomaly) {
                  const pt = waterChart.points[index];
                  if (!pt) return null;
                  return (
                    <Circle
                      key={index}
                      cx={pt.x}
                      cy={pt.y}
                      r="6"
                      fill={colors.semantic.warning}
                      stroke="#FAF8F5"
                      strokeWidth="2"
                    />
                  );
                }
                return null;
              })}
            </Svg>
          ) : null}
        </View>

        {/* X Axis Labels */}
        <View style={styles.chartXLabels}>
          <Text variant="meta-sm" style={styles.xAxisText}>
            {filteredLogs[0]?.date}
          </Text>
          <Text variant="meta-sm" style={styles.xAxisText}>
            {filteredLogs[Math.floor(filteredLogs.length / 2)]?.date}
          </Text>
          <Text variant="meta-sm" style={styles.xAxisText}>
            {lastLog.date}
          </Text>
        </View>
      </Card>

      {/* 6. Chart B: Environmental Metrics */}
      <SectionHeader title="Environmental Telemetry" />
      <View style={styles.tabSelectorRow}>
        <TouchableOpacity
          style={[styles.tabButton, envTab === "temp_hum" && styles.tabButtonActive]}
          onPress={() => setEnvTab("temp_hum")}
        >
          <Text
            variant="label-sm"
            style={[styles.tabText, envTab === "temp_hum" && styles.tabTextActive]}
          >
            Temp & Humidity
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, envTab === "tvoc" && styles.tabButtonActive]}
          onPress={() => setEnvTab("tvoc")}
        >
          <Text
            variant="label-sm"
            style={[styles.tabText, envTab === "tvoc" && styles.tabTextActive]}
          >
            Air Quality (TVOC)
          </Text>
        </TouchableOpacity>
      </View>

      <Card style={styles.chartCard}>
        {envTab === "temp_hum" ? (
          <>
            <View style={styles.chartLegendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendIndicator, { backgroundColor: "#3B82F6" }]} />
                <Text variant="label-sm" style={styles.chartSubLabel}>
                  Temp (°C)
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendIndicator, { backgroundColor: "#10B981" }]} />
                <Text variant="label-sm" style={styles.chartSubLabel}>
                  Humidity (%)
                </Text>
              </View>
            </View>

            <View style={styles.chartWrapper}>
              {/* Y Axis Labels */}
              <View style={styles.yAxisLabels}>
                <Text variant="meta-sm" style={styles.yAxisText}>
                  {Math.round(envBounds.max1)}°C
                </Text>
                <Text variant="meta-sm" style={styles.yAxisText}>
                  {Math.round((envBounds.max1 + envBounds.min1) / 2)}°C
                </Text>
                <Text variant="meta-sm" style={styles.yAxisText}>
                  {Math.round(envBounds.min1)}°C
                </Text>
              </View>

              {/* Svg lines */}
              {envChart.line1 ? (
                <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
                  {/* Grid Lines */}
                  <Line x1="0" y1="20" x2={CHART_WIDTH} y2="20" stroke={colors.accent.border} strokeWidth="1" strokeDasharray="3 3" />
                  <Line x1="0" y1={CHART_HEIGHT / 2} x2={CHART_WIDTH} y2={CHART_HEIGHT / 2} stroke={colors.accent.border} strokeWidth="1" strokeDasharray="3 3" />
                  <Line x1="0" y1={CHART_HEIGHT - 20} x2={CHART_WIDTH} y2={CHART_HEIGHT - 20} stroke={colors.accent.border} strokeWidth="1" />

                  {/* Humidity Line */}
                  {envChart.line2 && <Path d={envChart.line2} fill="none" stroke="#10B981" strokeWidth="2.2" />}

                  {/* Temp Line */}
                  <Path d={envChart.line1} fill="none" stroke="#3B82F6" strokeWidth="2.2" />
                </Svg>
              ) : null}
            </View>
          </>
        ) : (
          <>
            <View style={styles.chartLabelRow}>
              <Text variant="label-sm" style={styles.chartSubLabel}>
                TVOC Level (parts per billion)
              </Text>
              <Text variant="label-sm" style={styles.chartPeakLabel}>
                Current: {telemetryInsights.currentTVOC} ppb
              </Text>
            </View>

            <View style={styles.chartWrapper}>
              {/* Y Axis Labels */}
              <View style={styles.yAxisLabels}>
                <Text variant="meta-sm" style={styles.yAxisText}>
                  {Math.round(envBounds.max1)} ppb
                </Text>
                <Text variant="meta-sm" style={styles.yAxisText}>
                  {Math.round((envBounds.max1 + envBounds.min1) / 2)} ppb
                </Text>
                <Text variant="meta-sm" style={styles.yAxisText}>
                  {Math.round(envBounds.min1)} ppb
                </Text>
              </View>

              {/* Svg area */}
              {envChart.line1 ? (
                <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
                  <Defs>
                    <LinearGradient id="tvocGrad" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0%" stopColor="#A855F7" stopOpacity={0.3} />
                      <Stop offset="100%" stopColor="#A855F7" stopOpacity={0.0} />
                    </LinearGradient>
                  </Defs>

                  {/* Grid Lines */}
                  <Line x1="0" y1="20" x2={CHART_WIDTH} y2="20" stroke={colors.accent.border} strokeWidth="1" strokeDasharray="3 3" />
                  <Line x1="0" y1={CHART_HEIGHT / 2} x2={CHART_WIDTH} y2={CHART_HEIGHT / 2} stroke={colors.accent.border} strokeWidth="1" strokeDasharray="3 3" />
                  <Line x1="0" y1={CHART_HEIGHT - 20} x2={CHART_WIDTH} y2={CHART_HEIGHT - 20} stroke={colors.accent.border} strokeWidth="1" />

                  {envChart.area1 && <Path d={envChart.area1} fill="url(#tvocGrad)" />}
                  <Path d={envChart.line1} fill="none" stroke="#A855F7" strokeWidth="2.2" />
                </Svg>
              ) : null}
            </View>
          </>
        )}

        <View style={styles.chartXLabels}>
          <Text variant="meta-sm" style={styles.xAxisText}>
            {filteredLogs[0]?.date}
          </Text>
          <Text variant="meta-sm" style={styles.xAxisText}>
            {filteredLogs[Math.floor(filteredLogs.length / 2)]?.date}
          </Text>
          <Text variant="meta-sm" style={styles.xAxisText}>
            {lastLog.date}
          </Text>
        </View>
      </Card>

      {/* 7. TinyML Execution Status Widget */}
      <SectionHeader title="Uno Q TinyML AI Engine" />
      <Card style={styles.tinymlCard}>
        <View style={styles.tinymlHeader}>
          <Icon name="cpu" size={20} color={colors.accent.primary} />
          <Text variant="headline-lg" style={styles.tinymlTitle}>
            On-Device TinyML Execution Status
          </Text>
        </View>

        <View style={styles.tinymlRow}>
          <View style={styles.tinymlRowLeft}>
            <View style={styles.activeDot} />
            <Text variant="label-sm" style={styles.tinymlStatus}>
              Wake word listener active
            </Text>
          </View>
          <Text variant="meta-sm" style={styles.tinymlLatency}>
            Latency: 84ms
          </Text>
        </View>

        {/* TinyML Progress Metrics */}
        <View style={styles.progressRow}>
          <View style={styles.progressBarWrapper}>
            <Text variant="meta-sm" style={styles.progressLabel}>
              SRAM UTILIZATION
            </Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: "92%", backgroundColor: colors.accent.primary }]} />
            </View>
            <Text variant="meta-sm" style={styles.progressPercent}>
              92% (235 KB / 256 KB)
            </Text>
          </View>

          <View style={styles.progressBarWrapper}>
            <Text variant="meta-sm" style={styles.progressLabel}>
              FLASH STORAGE USED
            </Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: "74%", backgroundColor: "#4B5563" }]} />
            </View>
            <Text variant="meta-sm" style={styles.progressPercent}>
              74% (384 KB / 512 KB)
            </Text>
          </View>
        </View>
      </Card>

      <View style={styles.bottomSpacer} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: CONTAINER_PADDING,
    paddingTop: 24,
    paddingBottom: 48,
  },
  rangeSelectorContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 4,
    width: "100%",
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  segmentButtonActive: {
    backgroundColor: "#FAF8F5",
    elevation: 3,
    shadowColor: "#1B3629",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  segmentText: {
    fontWeight: "600",
    color: colors.text.muted,
  },
  segmentTextActive: {
    color: colors.accent.primary,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statsCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.accent.border,
  },
  statsCardWarning: {
    borderColor: colors.semantic.warning,
  },
  statsCardLabel: {
    color: colors.text.muted,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  statsCardValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  statsCardValue: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: "800",
  },
  statsCardUnit: {
    color: colors.text.muted,
    fontWeight: "600",
  },
  modeContainer: {
    flexDirection: "row",
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.accent.border,
  },
  modeTabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 8,
    borderRadius: 12,
  },
  modeTabButtonActive: {
    backgroundColor: colors.text.primary,
  },
  modeTabText: {
    color: colors.text.muted,
    fontWeight: "600",
  },
  modeTabTextActive: {
    color: "#FAF8F5",
  },
  advisorCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: colors.accent.border,
  },
  advisorWarning: {
    borderColor: colors.semantic.warning,
  },
  advisorNormal: {
    borderColor: colors.semantic.success,
  },
  advisorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: spacing.space2,
  },
  iconBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeWarning: {
    backgroundColor: "#FFF7ED",
  },
  badgeNormal: {
    backgroundColor: "#ECFDF5",
  },
  advisorTitle: {
    color: colors.text.primary,
    fontWeight: "700",
  },
  advisorText: {
    color: colors.text.primary,
    lineHeight: 20,
  },
  kidsStoryCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    marginBottom: 24,
  },
  kidsStoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: spacing.space2,
  },
  kidsStoryEmoji: {
    fontSize: 22,
  },
  kidsStoryTitle: {
    color: colors.text.primary,
    fontWeight: "800",
  },
  kidsStoryText: {
    color: colors.text.primary,
    lineHeight: 22,
    fontWeight: "500",
  },
  chartCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderColor: colors.accent.border,
    borderWidth: 1,
  },
  chartLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  chartLegendRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  chartSubLabel: {
    color: colors.text.muted,
    fontWeight: "600",
  },
  chartPeakLabel: {
    color: colors.text.primary,
    fontWeight: "700",
  },
  chartWrapper: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  yAxisLabels: {
    width: 40,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: 8,
    paddingVertical: 18,
  },
  yAxisText: {
    color: colors.text.muted,
    fontWeight: "600",
    fontSize: 10,
  },
  chartXLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingLeft: 40, // offset for y-axis labels
    paddingRight: 4,
  },
  xAxisText: {
    color: colors.text.muted,
    fontWeight: "600",
  },
  tabSelectorRow: {
    flexDirection: "row",
    gap: spacing.space2,
    marginBottom: 12,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.accent.border,
  },
  tabButtonActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  tabText: {
    fontWeight: "600",
    color: colors.text.muted,
  },
  tabTextActive: {
    color: "#FAF8F5",
  },
  tinymlCard: {
    padding: 16,
    borderColor: colors.accent.border,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 32,
  },
  tinymlHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.space2,
    marginBottom: 16,
  },
  tinymlTitle: {
    fontWeight: "700",
    color: colors.text.primary,
  },
  tinymlRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.background.primary,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent.border,
    marginBottom: 16,
  },
  tinymlRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.semantic.success,
  },
  tinymlStatus: {
    color: colors.text.primary,
    fontWeight: "600",
  },
  tinymlLatency: {
    color: colors.text.muted,
    fontWeight: "700",
  },
  progressRow: {
    gap: 16,
  },
  progressBarWrapper: {
    width: "100%",
  },
  progressLabel: {
    color: colors.text.muted,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: colors.accent.border,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressPercent: {
    color: colors.text.muted,
    fontWeight: "600",
    marginTop: 4,
    textAlign: "right",
  },
  bottomSpacer: {
    height: 48,
  },
});
