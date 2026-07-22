import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { CaptureCardProps } from "./Component.types";
import { styles } from "./Component.styles";
import { theme } from "../../theme/tokens";

export const CaptureCard: React.FC<CaptureCardProps> = ({ title, excerpt, timestamp, duration, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={theme.opacity.active}
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.time}>{timestamp}{duration ? " (" + duration + ")" : ""}</Text>
      </View>
      <Text style={styles.excerpt} numberOfLines={2}>{excerpt}</Text>
    </TouchableOpacity>
  );
};