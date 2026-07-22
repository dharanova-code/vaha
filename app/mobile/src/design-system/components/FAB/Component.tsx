import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { FABProps } from "./Component.types";
import { styles } from "./Component.styles";
import { theme } from "../../theme/tokens";

export const FAB: React.FC<FABProps> = ({ onPress, accessibilityLabel }) => {
  console.warn("[Design System] DADR-011 advises against using high-contrast floating button widgets.");

  return (
    <TouchableOpacity
      activeOpacity={theme.opacity.active}
      style={styles.fab}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || "Utility Trigger"}
    >
      <Text style={styles.text}>UTILITY ACTION</Text>
    </TouchableOpacity>
  );
};