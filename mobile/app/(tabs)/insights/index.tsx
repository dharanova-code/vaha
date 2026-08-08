import React, { useState, useMemo } from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions } from "react-native";
import Svg, { Path, Line, Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import {
  Screen,
  SectionHeader,
  SensorCard,
  Text,
  Card,
  Switch,
  colors,
  spacing,
  radius,
  Icon,
} from "../../../src/design-system";
import { useInsightsData } from "../../../src/features/insights/hooks/useInsightsData";
import { DailySensorLog } from "../../../src/features/insights/mock/mockSensorData";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_WIDTH = SCREEN_WIDTH - 48; // padding margin
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
  const [isKidsMode, setIsKidsMode] = useState<boolean>(false);

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

  // SVG Chart rendering helper for Water Consumption
  const waterChartPath = useMemo<{ line: string; area: string; points: Point[] }>(() => {
    if (filteredLogs.length === 0) return { line: "", area: "", points: [] };

    const values = filteredLogs.map((log) => log.waterConsumedLiters);
    const minVal = Math.min(...values) * 0.9;
    const maxVal = Math.max(...values) * 1.1;
    const valRange = maxVal - minVal || 1;

    const points = filteredLogs.map((log, index) => {
      const x = (index / (filteredLogs.length - 1)) * CHART_WIDTH;
      const y = CHART_HEIGHT - ((log.waterConsumedLiters - minVal) / valRange) * (CHART_HEIGHT - 40) - 20;
      return { x, y };
    });

    let linePath = `M ${points[0]!.x} ${points[0]!.y}`;
    for (let i = 1; i < points.length; i++) {
      linePath += ` L ${points[i]!.x} ${points[i]!.y}`;
    }

    const areaPath = `${linePath} L ${points[points.length - 1]!.x} ${CHART_HEIGHT} L ${points[0]!.x} ${CHART_HEIGHT} Z`;

    return { line: linePath, area: areaPath, points };
  }, [filteredLogs]);

  // SVG Chart rendering helper for Environmental log
  const envChartPath = useMemo<{ line1: string; line2?: string; area1?: string; points1: Point[]; points2?: Point[] }>(() => {
    if (filteredLogs.length === 0) return { line1: "", points1: [] };

    if (envTab === "temp_hum") {
      const temps = filteredLogs.map((log) => log.averageTemperature);
      const hums = filteredLogs.map((log) => log.averageHumidity);

      const minTemp = Math.min(...temps) * 0.9;
      const maxTemp = Math.max(...temps) * 1.1;
      const tempRange = maxTemp - minTemp || 1;

      const minHum = Math.min(...hums) * 0.9;
      const maxHum = Math.max(...hums) * 1.1;
      const humRange = maxHum - minHum || 1;

      const tempPoints = temps.map((val, index) => {
        const x = (index / (filteredLogs.length - 1)) * CHART_WIDTH;
        const y = CHART_HEIGHT - ((val - minTemp) / tempRange) * (CHART_HEIGHT - 40) - 20;
        return { x, y };
      });

      const humPoints = hums.map((val, index) => {
        const x = (index / (filteredLogs.length - 1)) * CHART_WIDTH;
        const y = CHART_HEIGHT - ((val - minHum) / humRange) * (CHART_HEIGHT - 40) - 20;
        return { x, y };
      });

      let line1 = `M ${tempPoints[0]!.x} ${tempPoints[0]!.y}`;
      let line2 = `M ${humPoints[0]!.x} ${humPoints[0]!.y}`;

      for (let i = 1; i < filteredLogs.length; i++) {
        line1 += ` L ${tempPoints[i]!.x} ${tempPoints[i]!.y}`;
        line2 += ` L ${humPoints[i]!.x} ${humPoints[i]!.y}`;
      }

      return { line1, line2, points1: tempPoints, points2: humPoints };
    } else {
      const tvocs = filteredLogs.map((log) => log.averageTVOC);
      const minVoc = Math.min(...tvocs) * 0.9;
      const maxVoc = Math.max(...tvocs) * 1.1;
      const vocRange = maxVoc - minVoc || 1;

      const points = tvocs.map((val, index) => {
        const x = (index / (filteredLogs.length - 1)) * CHART_WIDTH;
        const y = CHART_HEIGHT - ((val - minVoc) / vocRange) * (CHART_HEIGHT - 40) - 20;
        return { x, y };
      });

      let line1 = `M ${points[0]!.x} ${points[0]!.y}`;
      for (let i = 1; i < filteredLogs.length; i++) {
        line1 += ` L ${points[i]!.x} ${points[i]!.y}`;
      }

      const area1 = `${line1} L ${points[points.length - 1]!.x} ${CHART_HEIGHT} L ${points[0]!.x} ${CHART_HEIGHT} Z`;

      return { line1, area1, points1: points };
    }
  }, [filteredLogs, envTab]);

  // Today's stats compared to average
  const isHighWater = telemetryInsights.waterDeviationPercentage > 30;

  // Custom Kid-friendly narrative summary
  const kidsStory = useMemo(() => {
    if (isHighWater) {
      return {
        title: "Oh No! A Big Splash Day! 🚨",
        message: `We used ${lastLog.waterConsumedLiters}L of water today—that's enough to fill 4 giant swimming pools! If we waste it, the little ducklings in the forest pond won't have enough water to swim, and the wise frogs will get thirsty. Let's make sure the taps are turned off tight! 🦆💚`,
        color: "#FEF3C7", // amber warning tint
        borderColor: "#F59E0B",
        emoji: "🦆",
      };
    } else {
      return {
        title: "Yay! You Saved The Frogs! 🐸🎉",
        message: `Superstar! We used only ${lastLog.waterConsumedLiters}L of water today. Because you kept your water use low, the Blue Forest River is flowing happily, keeping 12 little frogs safe and cool! You are an environmental hero! 🐸💎`,
        color: "#ECFDF5", // emerald tint
        borderColor: "#10B981",
        emoji: "🐸",
      };
    }
  }, [isHighWater, lastLog]);

  return (
    <Screen scrollable style={styles.container}>
      {/* Time Range Selector */}
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

      {/* Main Metrics summary */}
      <View style={styles.statsGrid}>
        <SensorCard
          label="DAILY AVERAGE"
          value={telemetryInsights.averageWaterLiters.toString()}
          unit="L"
          status="normal"
        />
        <SensorCard
          label="MAX RECORDED"
          value={telemetryInsights.maxWaterLiters.toString()}
          unit="L"
          status={isHighWater ? "warning" : "normal"}
        />
      </View>

      {/* Kids Mode Toggle */}
      <Card style={styles.kidsModeCard}>
        <View style={styles.kidsModeHeader}>
          <View>
            <Text variant="headline-lg" style={styles.kidsModeTitle}>
              Kids Awareness Mode
            </Text>
            <Text variant="label-sm" style={styles.kidsModeSubtitle}>
              Translate water stats into stories for kids
            </Text>
          </View>
          <Switch value={isKidsMode} onValueChange={setIsKidsMode} />
        </View>
      </Card>

      {/* AI Advisor / Kids Narrative Card */}
      {!isKidsMode ? (
        <Card
          style={[
            styles.advisorCard,
            isHighWater ? styles.advisorWarning : styles.advisorNormal,
          ]}
        >
          <View style={styles.advisorHeader}>
            <View style={[styles.iconBadge, isHighWater ? styles.badgeWarning : styles.badgeNormal]}>
              <Icon
                name={isHighWater ? "alert-circle" : "check-circle"}
                size={20}
                color={isHighWater ? colors.semantic.warning : colors.semantic.success}
              />
            </View>
            <Text variant="headline-lg" style={styles.advisorTitle}>
              {isHighWater ? "Abnormal Water Usage Alert" : "Water Consumption Stable"}
            </Text>
          </View>
          <Text variant="body-md" style={styles.advisorText}>
            {isHighWater
              ? `Your water usage today is ${telemetryInsights.waterDeviationPercentage}% higher than your 3-week average of ${telemetryInsights.averageWaterLiters}L. This might indicate a leaky faucet or garden irrigation left active.`
              : `Awesome! Today's consumption (${lastLog.waterConsumedLiters}L) aligns perfectly with your average water usage profile. Clean habits preserved.`}
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
            <Text variant="headline-lg" style={styles.kidsStoryEmoji}>{kidsStory.emoji}</Text>
            <Text variant="headline-lg" style={styles.kidsStoryTitle}>
              {kidsStory.title}
            </Text>
          </View>
          <Text variant="body-md" style={styles.kidsStoryText}>
            {kidsStory.message}
          </Text>
        </View>
      )}

      {/* Chart 1: Water Consumption */}
      <SectionHeader title="Water Consumption Trends" />
      <Card style={styles.chartCard}>
        <View style={styles.chartLabelRow}>
          <Text variant="label-sm" style={styles.chartSubLabel}>Usage (Liters)</Text>
          <Text variant="label-sm" style={styles.chartPeakLabel}>Peak: {telemetryInsights.maxWaterLiters}L</Text>
        </View>
        
        {waterChartPath.line ? (
          <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
            <Defs>
              <LinearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={colors.accent.primary} stopOpacity={0.4} />
                <Stop offset="100%" stopColor={colors.accent.primary} stopOpacity={0.0} />
              </LinearGradient>
            </Defs>

            {/* Zero and Peak reference grid lines */}
            <Line x1="0" y1="10" x2={CHART_WIDTH} y2="10" stroke={colors.accent.border} strokeWidth="1" strokeDasharray="4 4" />
            <Line x1="0" y1={CHART_HEIGHT - 10} x2={CHART_WIDTH} y2={CHART_HEIGHT - 10} stroke={colors.accent.border} strokeWidth="1" />

            {/* Filled area */}
            <Path d={waterChartPath.area || ""} fill="url(#waterGrad)" />

            {/* Main Path */}
            <Path d={waterChartPath.line || ""} fill="none" stroke={colors.accent.primary} strokeWidth="2.5" />

            {/* Anomaly markers */}
            {waterChartPath.points && filteredLogs.map((log, index) => {
              if (log.isAnomaly) {
                const pt = waterChartPath.points[index];
                if (!pt) return null;
                return (
                  <Circle
                    key={index}
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill={colors.semantic.warning}
                    stroke="#FAF8F5"
                    strokeWidth="1.5"
                  />
                );
              }
              return null;
            })}
          </Svg>
        ) : null}

        {/* Date labels */}
        <View style={styles.chartXLabels}>
          <Text variant="meta-sm" style={styles.xAxisText}>{filteredLogs[0]?.date}</Text>
          <Text variant="meta-sm" style={styles.xAxisText}>
            {filteredLogs[Math.floor(filteredLogs.length / 2)]?.date}
          </Text>
          <Text variant="meta-sm" style={styles.xAxisText}>{lastLog.date}</Text>
        </View>
      </Card>

      {/* Environmental Logs Tab Selectors */}
      <SectionHeader title="Environmental Telemetry" />
      <View style={styles.tabSelectorRow}>
        <TouchableOpacity
          style={[styles.tabButton, envTab === "temp_hum" && styles.tabButtonActive]}
          onPress={() => setEnvTab("temp_hum")}
        >
          <Text variant="label-sm" style={[styles.tabText, envTab === "temp_hum" && styles.tabTextActive]}>
            Temp & Humidity
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, envTab === "tvoc" && styles.tabButtonActive]}
          onPress={() => setEnvTab("tvoc")}
        >
          <Text variant="label-sm" style={[styles.tabText, envTab === "tvoc" && styles.tabTextActive]}>
            Air Quality (TVOC)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chart 2: Telemetry Logs */}
      <Card style={styles.chartCard}>
        {envTab === "temp_hum" ? (
          <>
            <View style={styles.chartLegendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendIndicator, { backgroundColor: "#3B82F6" }]} />
                <Text variant="label-sm" style={styles.chartSubLabel}>Temp (°C)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendIndicator, { backgroundColor: "#10B981" }]} />
                <Text variant="label-sm" style={styles.chartSubLabel}>Humidity (%)</Text>
              </View>
            </View>

            {envChartPath.line1 ? (
              <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
                {/* Reference line */}
                <Line x1="0" y1={CHART_HEIGHT - 10} x2={CHART_WIDTH} y2={CHART_HEIGHT - 10} stroke={colors.accent.border} strokeWidth="1" />

                {/* Humidity Path (Line 2) */}
                {envChartPath.line2 && <Path d={envChartPath.line2} fill="none" stroke="#10B981" strokeWidth="2" />}

                {/* Temperature Path (Line 1) */}
                <Path d={envChartPath.line1} fill="none" stroke="#3B82F6" strokeWidth="2" />
              </Svg>
            ) : null}
          </>
        ) : (
          <>
            <View style={styles.chartLabelRow}>
              <Text variant="label-sm" style={styles.chartSubLabel}>TVOC Level (ppb)</Text>
              <Text variant="label-sm" style={styles.chartPeakLabel}>Avg: {telemetryInsights.currentTVOC} ppb</Text>
            </View>

            {envChartPath.line1 ? (
              <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
                <Defs>
                  <LinearGradient id="tvocGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#A855F7" stopOpacity={0.3} />
                    <Stop offset="100%" stopColor="#A855F7" stopOpacity={0.0} />
                  </LinearGradient>
                </Defs>

                {/* Reference grid line */}
                <Line x1="0" y1={CHART_HEIGHT - 10} x2={CHART_WIDTH} y2={CHART_HEIGHT - 10} stroke={colors.accent.border} strokeWidth="1" />

                {/* Filled Area */}
                {envChartPath.area1 && <Path d={envChartPath.area1} fill="url(#tvocGrad)" />}

                {/* Path */}
                <Path d={envChartPath.line1 || ""} fill="none" stroke="#A855F7" strokeWidth="2.5" />
              </Svg>
            ) : null}
          </>
        )}

        <View style={styles.chartXLabels}>
          <Text variant="meta-sm" style={styles.xAxisText}>{filteredLogs[0]?.date}</Text>
          <Text variant="meta-sm" style={styles.xAxisText}>
            {filteredLogs[Math.floor(filteredLogs.length / 2)]?.date}
          </Text>
          <Text variant="meta-sm" style={styles.xAxisText}>{lastLog.date}</Text>
        </View>
      </Card>

      {/* Arduino Uno Q TinyML monitor Widget */}
      <SectionHeader title="Uno Q TinyML AI Engine" />
      <Card style={styles.tinymlCard}>
        <View style={styles.tinymlHeader}>
          <Icon name="cpu" size={24} color={colors.accent.primary} />
          <Text variant="headline-lg" style={styles.tinymlTitle}>
            On-Device TinyML Execution Status
          </Text>
        </View>
        
        <View style={styles.tinymlGrid}>
          <View style={styles.tinymlGridItem}>
            <Text variant="label-sm" style={styles.tinymlGridLabel}>VOICE MODEL</Text>
            <Text variant="body-md" style={styles.tinymlGridValue}>Marvin Core v1.0</Text>
          </View>
          <View style={styles.tinymlGridItem}>
            <Text variant="label-sm" style={styles.tinymlGridLabel}>INFERENCE LATENCY</Text>
            <Text variant="body-md" style={styles.tinymlGridValue}>84 ms</Text>
          </View>
          <View style={styles.tinymlGridItem}>
            <Text variant="label-sm" style={styles.tinymlGridLabel}>UNO Q SRAM USED</Text>
            <Text variant="body-md" style={styles.tinymlGridValue}>92% (235 KB)</Text>
          </View>
          <View style={styles.tinymlGridItem}>
            <Text variant="label-sm" style={styles.tinymlGridLabel}>WAKE ENGINE STATE</Text>
            <Text variant="body-md" style={[styles.tinymlGridValue, { color: colors.semantic.success }]}>Active / Listening</Text>
          </View>
        </View>
      </Card>

      <View style={styles.bottomSpacer} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  rangeSelectorContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: colors.background.secondary,
    borderRadius: radius.medium,
    padding: 4,
    width: "100%",
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: radius.small,
  },
  segmentButtonActive: {
    backgroundColor: "#FAF8F5",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  segmentText: {
    fontWeight: "600",
    color: colors.text.muted,
  },
  segmentTextActive: {
    color: colors.text.primary,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  kidsModeCard: {
    padding: 16,
    marginBottom: 20,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.accent.border,
  },
  kidsModeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  kidsModeTitle: {
    color: colors.text.primary,
    fontWeight: "700",
  },
  kidsModeSubtitle: {
    color: colors.text.muted,
    marginTop: 2,
  },
  advisorCard: {
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
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
    width: 28,
    height: 28,
    borderRadius: 14,
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
    borderRadius: radius.medium,
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
  chartXLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 4,
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
    borderRadius: radius.medium,
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
  tinymlGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 16,
  },
  tinymlGridItem: {
    width: "50%",
  },
  tinymlGridLabel: {
    color: colors.text.muted,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  tinymlGridValue: {
    fontWeight: "700",
    color: colors.text.primary,
    marginTop: 2,
  },
  bottomSpacer: {
    height: 48,
  },
});
