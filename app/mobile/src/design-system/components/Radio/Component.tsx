import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { RadioProps } from "./Component.types";
import { styles } from "./Component.styles";
import { theme } from "../../theme/tokens";

export const Radio: React.FC<RadioProps> = ({ selected, onSelect, label }) => {
  return (
    <TouchableOpacity
      activeOpacity={theme.opacity.active}
      style={styles.container}
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
    >
      <View style={[styles.outerCircle, selected && styles.selectedOuterCircle]}>
        {selected && <View style={styles.innerCircle} />}
      </View>
      {!!label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};