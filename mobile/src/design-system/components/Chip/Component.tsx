import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { ChipProps } from "./Component.types";
import { styles } from "./Component.styles";

export const Chip: React.FC<ChipProps> = ({ label, selected = false, onPress }) => {
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.chip, selected && styles.selected]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: selected }}
      >
        <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.chip, selected && styles.selected]}>
      <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
    </View>
  );
};
