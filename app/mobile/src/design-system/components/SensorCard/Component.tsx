import React from "react";
import { View, Text } from "react-native";
import { SensorCardProps } from "./Component.types";
import { styles } from "./Component.styles";

export const SensorCard: React.FC<SensorCardProps> = ({ label, value, unit, status = "normal" }) => {
  return (
    <View style={[styles.card, status !== "normal" && styles[status]]}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <Text style={styles.value}>
        {value}
        {unit && <Text style={styles.unit}> {unit}</Text>}
      </Text>
    </View>
  );
};