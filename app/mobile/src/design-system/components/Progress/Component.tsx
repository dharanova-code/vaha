import React from "react";
import { View, DimensionValue } from "react-native";
import { ProgressProps } from "./Component.types";
import { styles } from "./Component.styles";

export const Progress: React.FC<ProgressProps> = ({ progress }) => {
  const percentage = Math.min(Math.max(progress, 0), 1) * 100;

  return (
    <View testID="progress-track" style={styles.track} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: percentage }}>
      <View style={[styles.bar, { width: `${percentage}%` as DimensionValue }]} />
    </View>
  );
};
