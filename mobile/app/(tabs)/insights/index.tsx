import React, { useState, useMemo } from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions, ScrollView, Modal, FlatList, GestureResponderEvent, LayoutChangeEvent } from "react-native";
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
import { DailySensorLog, HourlySensorLog } from "../../../src/features/insights/mock/mockSensorData";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CONTAINER_PADDING = 24;
const CHART_HEIGHT = 160;

interface Point {
  x: number;
  y: number;
}

export default function InsightsScreen() {
  const {
    sensorLogs,
    hourlyLogs,
    telemetryInsights,
  } = useInsightsData();

  // Presets: "today", 7 (days), 30 (days), "custom"
  const [timeRange, setTimeRange] = useState<"today" | 7 | 30 | "custom">("today");
  const [envTab, setEnvTab] = useState<"temp_hum" | "tvoc">("temp_hum");

  // Dynamic layout measurement to prevent graph box overflow on any mobile screen size
  const [chartWidth, setChartWidth] = useState(SCREEN_WIDTH - CONTAINER_PADDING * 2 - 80);

  // Custom date selection state
  const [customStartDate, setCustomStartDate] = useState<string>(sensorLogs[0]?.date || "Jul 01");
  const [customEndDate, setCustomEndDate] = useState<string>(sensorLogs[sensorLogs.length - 1]?.date || "Aug 14");
  
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(false);
  const [isSelectingEndDate, setIsSelectingEndDate] = useState(false);

  // Touch tracking state for interactive graph scrubbing
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

  // Filter daily sensor logs based on selected range/custom dates
  const filteredLogs = useMemo<DailySensorLog[]>(() => {
    if (timeRange === "today") return [];
    if (timeRange === "custom") {
      const startIndex = sensorLogs.findIndex((log) => log.date === customStartDate);
      const endIndex = sensorLogs.findIndex((log) => log.date === customEndDate);
      if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
        return sensorLogs.slice(startIndex, endIndex + 1);
      }
      return sensorLogs;
    }
    return sensorLogs.slice(-timeRange);
  }, [sensorLogs, timeRange, customStartDate, customEndDate]);

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
    if (timeRange === "today") {
      const values = hourlyLogs.map((log) => log.waterConsumedLiters);
      const min = Math.min(...values) * 0.9;
      const max = Math.max(...values) * 1.1;
      return { min, max, range: max - min || 1 };
    }
    if (filteredLogs.length === 0) return { min: 0, max: 200, range: 200 };
    const values = filteredLogs.map((log) => log.waterConsumedLiters);
    const min = Math.min(...values) * 0.9;
    const max = Math.max(...values) * 1.1;
    return { min, max, range: max - min || 1 };
  }, [filteredLogs, hourlyLogs, timeRange]);

  // Water Chart points and path helper
  const waterChart = useMemo(() => {
    const list = timeRange === "today" ? hourlyLogs : filteredLogs;
    if (list.length === 0) return { linePath: "", areaPath: "", points: [] };

    const { min, range } = waterBounds;
    const points = list.map((log, index) => {
      const x = (index / (list.length - 1)) * chartWidth;
      const val = timeRange === "today" ? (log as HourlySensorLog).waterConsumedLiters : (log as DailySensorLog).waterConsumedLiters;
      const y = CHART_HEIGHT - ((val - min) / range) * (CHART_HEIGHT - 40) - 20;
      return { x, y };
    });

    let linePath = `M ${points[0]!.x} ${points[0]!.y}`;
    for (let i = 1; i < points.length; i++) {
      linePath += ` L ${points[i]!.x} ${points[i]!.y}`;
    }

    const areaPath = `${linePath} L ${points[points.length - 1]!.x} ${CHART_HEIGHT} L ${points[0]!.x} ${CHART_HEIGHT} Z`;

    return { linePath, areaPath, points };
  }, [filteredLogs, hourlyLogs, timeRange, waterBounds, chartWidth]);

  // Environmental bounds (Temp/Hum/TVOC)
  const envBounds = useMemo(() => {
    const list = timeRange === "today" ? hourlyLogs : filteredLogs;
    if (list.length === 0) return { min1: 0, max1: 100, min2: 0, max2: 100 };

    if (envTab === "temp_hum") {
      const temps = list.map((log) => (timeRange === "today" ? (log as HourlySensorLog).temperature : (log as DailySensorLog).averageTemperature));
      const hums = list.map((log) => (timeRange === "today" ? (log as HourlySensorLog).humidity : (log as DailySensorLog).averageHumidity));
      return {
        min1: Math.min(...temps) * 0.9,
        max1: Math.max(...temps) * 1.1,
        min2: Math.min(...hums) * 0.9,
        max2: Math.max(...hums) * 1.1,
      };
    } else {
      const tvocs = list.map((log) => (timeRange === "today" ? (log as HourlySensorLog).tvoc : (log as DailySensorLog).averageTVOC));
      return {
        min1: Math.min(...tvocs) * 0.9,
        max1: Math.max(...tvocs) * 1.1,
      };
    }
  }, [filteredLogs, hourlyLogs, timeRange, envTab]);

  // Environmental Chart points and path helper
  const envChart = useMemo(() => {
    const list = timeRange === "today" ? hourlyLogs : filteredLogs;
    if (list.length === 0) return { line1: "", line2: "", area1: "", points1: [], points2: [] };

    const { min1, max1, min2, max2 } = envBounds;
    const range1 = max1 - min1 || 1;

    if (envTab === "temp_hum" && min2 !== undefined && max2 !== undefined) {
      const range2 = max2 - min2 || 1;

      const points1 = list.map((log, index) => {
        const x = (index / (list.length - 1)) * chartWidth;
        const val = timeRange === "today" ? (log as HourlySensorLog).temperature : (log as DailySensorLog).averageTemperature;
        const y = CHART_HEIGHT - ((val - min1) / range1) * (CHART_HEIGHT - 40) - 20;
        return { x, y };
      });

      const points2 = list.map((log, index) => {
        const x = (index / (list.length - 1)) * chartWidth;
        const val = timeRange === "today" ? (log as HourlySensorLog).humidity : (log as DailySensorLog).averageHumidity;
        const y = CHART_HEIGHT - ((val - min2) / range2) * (CHART_HEIGHT - 40) - 20;
        return { x, y };
      });

      let line1 = `M ${points1[0]!.x} ${points1[0]!.y}`;
      let line2 = `M ${points2[0]!.x} ${points2[0]!.y}`;

      for (let i = 1; i < list.length; i++) {
        line1 += ` L ${points1[i]!.x} ${points1[i]!.y}`;
        line2 += ` L ${points2[i]!.x} ${points2[i]!.y}`;
      }

      return { line1, line2, points1, points2 };
    } else {
      const points1 = list.map((log, index) => {
        const x = (index / (list.length - 1)) * chartWidth;
        const val = timeRange === "today" ? (log as HourlySensorLog).tvoc : (log as DailySensorLog).averageTVOC;
        const y = CHART_HEIGHT - ((val - min1) / range1) * (CHART_HEIGHT - 40) - 20;
        return { x, y };
      });

      let line1 = `M ${points1[0]!.x} ${points1[0]!.y}`;
      for (let i = 1; i < list.length; i++) {
        line1 += ` L ${points1[i]!.x} ${points1[i]!.y}`;
      }

      const area1 = `${line1} L ${points1[points1.length - 1]!.x} ${CHART_HEIGHT} L ${points1[0]!.x} ${CHART_HEIGHT} Z`;

      return { line1, area1, points1 };
    }
  }, [filteredLogs, hourlyLogs, timeRange, envTab, envBounds, chartWidth]);



  // Handle graph touch/scrub gesture calculation
  const handleGraphTouch = (locationX: number) => {
    const list = timeRange === "today" ? hourlyLogs : filteredLogs;
    if (list.length <= 1) return;

    if (locationX < 0 || locationX > chartWidth) {
      setActivePointIndex(null);
      return;
    }

    let index = Math.round((locationX / chartWidth) * (list.length - 1));
    index = Math.max(0, Math.min(list.length - 1, index));
    setActivePointIndex(index);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    // Offset padding and yAxis labels (48px yAxis + 32px padding = 80px total offset)
    setChartWidth(width - 48 - 32); 
  };

  const activeWaterValue = useMemo(() => {
    if (activePointIndex === null) return null;
    if (timeRange === "today") {
      return hourlyLogs[activePointIndex]?.waterConsumedLiters;
    }
    return filteredLogs[activePointIndex]?.waterConsumedLiters;
  }, [activePointIndex, hourlyLogs, filteredLogs, timeRange]);

  const activeWaterLabel = useMemo(() => {
    if (activePointIndex === null) return "";
    if (timeRange === "today") {
      return hourlyLogs[activePointIndex]?.time || "";
    }
    return filteredLogs[activePointIndex]?.date || "";
  }, [activePointIndex, hourlyLogs, filteredLogs, timeRange]);

  const activeEnvLabel = useMemo(() => {
    if (activePointIndex === null) return "";
    const list = timeRange === "today" ? hourlyLogs : filteredLogs;
    return timeRange === "today" ? (list[activePointIndex] as HourlySensorLog)?.time : (list[activePointIndex] as DailySensorLog)?.date;
  }, [activePointIndex, hourlyLogs, filteredLogs, timeRange]);

  const activeEnvValue1 = useMemo(() => {
    if (activePointIndex === null) return null;
    const list = timeRange === "today" ? hourlyLogs : filteredLogs;
    return timeRange === "today" ? (list[activePointIndex] as HourlySensorLog)?.temperature : (list[activePointIndex] as DailySensorLog)?.averageTemperature;
  }, [activePointIndex, hourlyLogs, filteredLogs, timeRange]);

  const activeEnvValue2 = useMemo(() => {
    if (activePointIndex === null) return null;
    const list = timeRange === "today" ? hourlyLogs : filteredLogs;
    return timeRange === "today" ? (list[activePointIndex] as HourlySensorLog)?.humidity : (list[activePointIndex] as DailySensorLog)?.averageHumidity;
  }, [activePointIndex, hourlyLogs, filteredLogs, timeRange]);

  const activeTvocValue = useMemo(() => {
    if (activePointIndex === null) return null;
    const list = timeRange === "today" ? hourlyLogs : filteredLogs;
    return timeRange === "today" ? (list[activePointIndex] as HourlySensorLog)?.tvoc : (list[activePointIndex] as DailySensorLog)?.averageTVOC;
  }, [activePointIndex, hourlyLogs, filteredLogs, timeRange]);

  return (
    <Screen scrollable style={styles.container}>
      {/* 1. Time Range Selector Header */}
      <View style={styles.rangeSelectorContainer}>
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[styles.segmentButton, timeRange === "today" && styles.segmentButtonActive]}
            onPress={() => { setTimeRange("today"); setActivePointIndex(null); }}
          >
            <Text variant="label-sm" style={[styles.segmentText, timeRange === "today" && styles.segmentTextActive]}>
              Today
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentButton, timeRange === 7 && styles.segmentButtonActive]}
            onPress={() => { setTimeRange(7); setActivePointIndex(null); }}
          >
            <Text variant="label-sm" style={[styles.segmentText, timeRange === 7 && styles.segmentTextActive]}>
              7 Days
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentButton, timeRange === 30 && styles.segmentButtonActive]}
            onPress={() => { setTimeRange(30); setActivePointIndex(null); }}
          >
            <Text variant="label-sm" style={[styles.segmentText, timeRange === 30 && styles.segmentTextActive]}>
              30 Days
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentButton, timeRange === "custom" && styles.segmentButtonActive]}
            onPress={() => { setTimeRange("custom"); setActivePointIndex(null); }}
          >
            <Text variant="label-sm" style={[styles.segmentText, timeRange === "custom" && styles.segmentTextActive]}>
              Custom
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Custom Date Range Pickers (Visible only when 'custom' selected) */}
      {timeRange === "custom" && (
        <Card style={styles.customDateCard}>
          <Text variant="label-sm" style={styles.customDateTitle}>
            Custom Date Range
          </Text>
          <View style={styles.customDateRow}>
            <TouchableOpacity
              style={styles.dateSelectorBtn}
              onPress={() => setIsSelectingStartDate(true)}
            >
              <Text variant="meta-sm" style={styles.dateSelectorLabel}>START DATE</Text>
              <Text variant="body-md" style={styles.dateSelectorValue}>{customStartDate}</Text>
            </TouchableOpacity>

            <Icon name="arrow-right" size={16} color={colors.text.muted} />

            <TouchableOpacity
              style={styles.dateSelectorBtn}
              onPress={() => setIsSelectingEndDate(true)}
            >
              <Text variant="meta-sm" style={styles.dateSelectorLabel}>END DATE</Text>
              <Text variant="body-md" style={styles.dateSelectorValue}>{customEndDate}</Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}



      {/* 5. Chart A: Water Consumption Trends */}
      <SectionHeader title={timeRange === "today" ? "Hourly Water Flow rate" : "Water Consumption Trends"} />
      <View onLayout={handleLayout}>
        <Card style={styles.chartCard}>
          {/* Floating Interactive Tooltip */}
          {activePointIndex !== null && activeWaterValue !== null ? (
            <View style={styles.tooltipBubble}>
              <Text variant="label-sm" style={styles.tooltipText}>
                {activeWaterLabel}: {activeWaterValue} L
              </Text>
            </View>
          ) : (
            <View style={styles.chartLabelRow}>
              <Text variant="label-sm" style={styles.chartSubLabel}>
                {timeRange === "today" ? "Flow Rate (Liters/hour)" : "Daily Volume (Liters)"}
              </Text>
              <Text variant="label-sm" style={styles.chartPeakLabel}>
                {timeRange === "today" ? "Scrub graph to view hourly data" : `Peak: ${telemetryInsights.maxWaterLiters}L`}
              </Text>
            </View>
          )}

          {/* Graph content box with custom touch handlers */}
          <View style={styles.chartWrapper}>
            {/* Y Axis Labels */}
            <View style={styles.yAxisLabels}>
              <Text variant="meta-sm" style={styles.yAxisText}>{Math.round(waterBounds.max)}L</Text>
              <Text variant="meta-sm" style={styles.yAxisText}>{Math.round((waterBounds.max + waterBounds.min) / 2)}L</Text>
              <Text variant="meta-sm" style={styles.yAxisText}>{Math.round(waterBounds.min)}L</Text>
            </View>

            {/* SVG Canvas wrapped in a touch-sensitive View */}
            {waterChart.linePath ? (
              <View
                onTouchStart={(e: GestureResponderEvent) => handleGraphTouch(e.nativeEvent.locationX)}
                onTouchMove={(e: GestureResponderEvent) => handleGraphTouch(e.nativeEvent.locationX)}
                onTouchEnd={() => setActivePointIndex(null)}
              >
                <Svg width={chartWidth} height={CHART_HEIGHT}>
                  <Defs>
                    <LinearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0%" stopColor={colors.accent.primary} stopOpacity={0.35} />
                      <Stop offset="100%" stopColor={colors.accent.primary} stopOpacity={0.0} />
                    </LinearGradient>
                  </Defs>

                  {/* Grid Lines */}
                  <Line x1="0" y1="20" x2={chartWidth} y2="20" stroke={colors.accent.border} strokeWidth="1" strokeDasharray="3 3" />
                  <Line x1="0" y1={CHART_HEIGHT / 2} x2={chartWidth} y2={CHART_HEIGHT / 2} stroke={colors.accent.border} strokeWidth="1" strokeDasharray="3 3" />
                  <Line x1="0" y1={CHART_HEIGHT - 20} x2={chartWidth} y2={CHART_HEIGHT - 20} stroke={colors.accent.border} strokeWidth="1" />

                  {/* Area path */}
                  <Path d={waterChart.areaPath} fill="url(#waterGrad)" />

                  {/* Main Line path */}
                  <Path d={waterChart.linePath} fill="none" stroke={colors.accent.primary} strokeWidth="2.5" />

                  {/* Anomaly Highlight Circles */}
                  {timeRange !== "today" && waterChart.points && filteredLogs.map((log, index) => {
                    if (log.isAnomaly) {
                      const pt = waterChart.points[index];
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

                  {/* Interactive vertical scrub indicator */}
                  {activePointIndex !== null && waterChart.points[activePointIndex] && (
                    <>
                      <Line
                        x1={waterChart.points[activePointIndex]!.x}
                        y1={0}
                        x2={waterChart.points[activePointIndex]!.x}
                        y2={CHART_HEIGHT}
                        stroke={colors.accent.primary}
                        strokeWidth="1"
                        strokeDasharray="3 3"
                      />
                      <Circle
                        cx={waterChart.points[activePointIndex]!.x}
                        cy={waterChart.points[activePointIndex]!.y}
                        r="8"
                        fill={colors.accent.primary}
                        stroke="#FAF8F5"
                        strokeWidth="2.5"
                      />
                    </>
                  )}
                </Svg>
              </View>
            ) : null}
          </View>

          {/* X Axis Labels */}
          <View style={styles.chartXLabels}>
            {timeRange === "today" ? (
              <>
                <Text variant="meta-sm" style={styles.xAxisText}>00:00</Text>
                <Text variant="meta-sm" style={styles.xAxisText}>12:00</Text>
                <Text variant="meta-sm" style={styles.xAxisText}>23:00</Text>
              </>
            ) : (
              <>
                <Text variant="meta-sm" style={styles.xAxisText}>{filteredLogs[0]?.date}</Text>
                <Text variant="meta-sm" style={styles.xAxisText}>{filteredLogs[Math.floor(filteredLogs.length / 2)]?.date}</Text>
                <Text variant="meta-sm" style={styles.xAxisText}>{lastLog.date}</Text>
              </>
            )}
          </View>
        </Card>
      </View>

      {/* 6. Chart B: Environmental Metrics */}
      <SectionHeader title={timeRange === "today" ? "Environmental Telemetry (Today)" : "Environmental Telemetry"} />
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

      <Card style={styles.chartCard}>
        {activePointIndex !== null ? (
          <View style={styles.tooltipBubble}>
            <Text variant="label-sm" style={styles.tooltipText}>
              {envTab === "temp_hum" ? (
                `${activeEnvLabel}: ${activeEnvValue1}°C | ${activeEnvValue2}% Hum`
              ) : (
                `${activeEnvLabel}: ${activeTvocValue} ppb`
              )}
            </Text>
          </View>
        ) : (
          envTab === "temp_hum" ? (
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
          ) : (
            <View style={styles.chartLabelRow}>
              <Text variant="label-sm" style={styles.chartSubLabel}>TVOC (parts per billion)</Text>
              <Text variant="label-sm" style={styles.chartPeakLabel}>Scrub graph for air quality metrics</Text>
            </View>
          )
        )}

        <View style={styles.chartWrapper}>
          {/* Y Axis Labels */}
          <View style={styles.yAxisLabels}>
            {envTab === "temp_hum" ? (
              <>
                <Text variant="meta-sm" style={styles.yAxisText}>{Math.round(envBounds.max1)}°C</Text>
                <Text variant="meta-sm" style={styles.yAxisText}>{Math.round((envBounds.max1 + envBounds.min1) / 2)}°C</Text>
                <Text variant="meta-sm" style={styles.yAxisText}>{Math.round(envBounds.min1)}°C</Text>
              </>
            ) : (
              <>
                <Text variant="meta-sm" style={styles.yAxisText}>{Math.round(envBounds.max1)} ppb</Text>
                <Text variant="meta-sm" style={styles.yAxisText}>{Math.round((envBounds.max1 + envBounds.min1) / 2)} ppb</Text>
                <Text variant="meta-sm" style={styles.yAxisText}>{Math.round(envBounds.min1)} ppb</Text>
              </>
            )}
          </View>

          {/* Svg lines wrapped in a touch-sensitive View */}
          {envChart.line1 ? (
            <View
              onTouchStart={(e: GestureResponderEvent) => handleGraphTouch(e.nativeEvent.locationX)}
              onTouchMove={(e: GestureResponderEvent) => handleGraphTouch(e.nativeEvent.locationX)}
              onTouchEnd={() => setActivePointIndex(null)}
            >
              <Svg width={chartWidth} height={CHART_HEIGHT}>
                {/* Grid Lines */}
                <Line x1="0" y1="20" x2={chartWidth} y2="20" stroke={colors.accent.border} strokeWidth="1" strokeDasharray="3 3" />
                <Line x1="0" y1={CHART_HEIGHT / 2} x2={chartWidth} y2={CHART_HEIGHT / 2} stroke={colors.accent.border} strokeWidth="1" strokeDasharray="3 3" />
                <Line x1="0" y1={CHART_HEIGHT - 20} x2={chartWidth} y2={CHART_HEIGHT - 20} stroke={colors.accent.border} strokeWidth="1" />

                {envTab === "temp_hum" ? (
                  <>
                    {envChart.line2 && <Path d={envChart.line2} fill="none" stroke="#10B981" strokeWidth="2.2" />}
                    <Path d={envChart.line1} fill="none" stroke="#3B82F6" strokeWidth="2.2" />

                    {/* Active touch indicator */}
                    {activePointIndex !== null && envChart.points1 && envChart.points1[activePointIndex] && (
                      <>
                        <Line
                          x1={envChart.points1[activePointIndex]!.x}
                          y1={0}
                          x2={envChart.points1[activePointIndex]!.x}
                          y2={CHART_HEIGHT}
                          stroke={colors.accent.primary}
                          strokeWidth="1"
                          strokeDasharray="3 3"
                        />
                        <Circle cx={envChart.points1[activePointIndex]!.x} cy={envChart.points1[activePointIndex]!.y} r="6" fill="#3B82F6" stroke="#FAF8F5" strokeWidth="2" />
                        {envChart.points2 && envChart.points2[activePointIndex] && (
                          <Circle cx={envChart.points2[activePointIndex]!.x} cy={envChart.points2[activePointIndex]!.y} r="6" fill="#10B981" stroke="#FAF8F5" strokeWidth="2" />
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Defs>
                      <LinearGradient id="tvocGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0%" stopColor="#A855F7" stopOpacity="0.3" />
                        <Stop offset="100%" stopColor="#A855F7" stopOpacity="0.0" />
                      </LinearGradient>
                    </Defs>
                    {envChart.area1 && <Path d={envChart.area1} fill="url(#tvocGrad)" />}
                    <Path d={envChart.line1} fill="none" stroke="#A855F7" strokeWidth="2.2" />

                    {/* Active touch indicator */}
                    {activePointIndex !== null && envChart.points1 && envChart.points1[activePointIndex] && (
                      <>
                        <Line
                          x1={envChart.points1[activePointIndex]!.x}
                          y1={0}
                          x2={envChart.points1[activePointIndex]!.x}
                          y2={CHART_HEIGHT}
                          stroke={colors.accent.primary}
                          strokeWidth="1"
                          strokeDasharray="3 3"
                        />
                        <Circle cx={envChart.points1[activePointIndex]!.x} cy={envChart.points1[activePointIndex]!.y} r="7" fill="#A855F7" stroke="#FAF8F5" strokeWidth="2" />
                      </>
                    )}
                  </>
                )}
              </Svg>
            </View>
          ) : null}
        </View>

        <View style={styles.chartXLabels}>
          {timeRange === "today" ? (
            <>
              <Text variant="meta-sm" style={styles.xAxisText}>00:00</Text>
              <Text variant="meta-sm" style={styles.xAxisText}>12:00</Text>
              <Text variant="meta-sm" style={styles.xAxisText}>23:00</Text>
            </>
          ) : (
            <>
              <Text variant="meta-sm" style={styles.xAxisText}>{filteredLogs[0]?.date}</Text>
              <Text variant="meta-sm" style={styles.xAxisText}>{filteredLogs[Math.floor(filteredLogs.length / 2)]?.date}</Text>
              <Text variant="meta-sm" style={styles.xAxisText}>{lastLog.date}</Text>
            </>
          )}
        </View>
      </Card>

      {/* Date Pickers Modals */}
      <Modal visible={isSelectingStartDate} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <Card style={styles.pickerModalCard}>
            <Text variant="headline-lg" style={styles.modalTitle}>Select Start Date</Text>
            <FlatList
              data={sensorLogs}
              keyExtractor={(item) => item.date}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.pickerItem, item.date === customStartDate && styles.pickerItemActive]}
                  onPress={() => {
                    setCustomStartDate(item.date);
                    setIsSelectingStartDate(false);
                  }}
                >
                  <Text variant="body-md" style={[styles.pickerItemText, item.date === customStartDate && styles.pickerItemTextActive]}>
                    {item.date}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </Card>
        </View>
      </Modal>

      <Modal visible={isSelectingEndDate} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <Card style={styles.pickerModalCard}>
            <Text variant="headline-lg" style={styles.modalTitle}>Select End Date</Text>
            <FlatList
              data={sensorLogs}
              keyExtractor={(item) => item.date}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.pickerItem, item.date === customEndDate && styles.pickerItemActive]}
                  onPress={() => {
                    setCustomEndDate(item.date);
                    setIsSelectingEndDate(false);
                  }}
                >
                  <Text variant="body-md" style={[styles.pickerItemText, item.date === customEndDate && styles.pickerItemTextActive]}>
                    {item.date}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </Card>
        </View>
      </Modal>

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
  customDateCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.accent.border,
  },
  customDateTitle: {
    color: colors.text.muted,
    fontWeight: "700",
    marginBottom: 12,
  },
  customDateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  dateSelectorBtn: {
    flex: 1,
    backgroundColor: "#FAF8F5",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent.border,
  },
  dateSelectorLabel: {
    color: colors.text.muted,
    fontWeight: "700",
    fontSize: 9,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  dateSelectorValue: {
    fontWeight: "700",
    color: colors.text.primary,
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
    width: 48,
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
    paddingLeft: 48, // offset for y-axis labels
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
  bottomSpacer: {
    height: 48,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(27, 54, 41, 0.4)",
    justifyContent: "flex-end",
  },
  pickerModalCard: {
    backgroundColor: "#FAF8F5",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: 400,
  },
  modalTitle: {
    color: colors.text.primary,
    fontWeight: "800",
    marginBottom: 16,
  },
  pickerItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.accent.border,
  },
  pickerItemActive: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  pickerItemText: {
    color: colors.text.primary,
    fontWeight: "600",
  },
  pickerItemTextActive: {
    color: colors.accent.primary,
    fontWeight: "800",
  },
  tooltipBubble: {
    alignSelf: "flex-start",
    backgroundColor: colors.text.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  tooltipText: {
    color: "#FAF8F5",
    fontWeight: "700",
  },
});
