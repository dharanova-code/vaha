import React from "react";
import { TouchableOpacity, View } from "react-native";
import { SwitchProps } from "./Component.types";
import { styles } from "./Component.styles";
import { theme } from "../../theme/tokens";

export const Switch: React.FC<SwitchProps> = ({ value, onValueChange }) => {
  return (
    <TouchableOpacity
      activeOpacity={theme.opacity.active}
      style={[styles.track, value && styles.trackActive]}
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <View style={[styles.thumb, value && styles.thumbActive]} />
    </TouchableOpacity>
  );
};