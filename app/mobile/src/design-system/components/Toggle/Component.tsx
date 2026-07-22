import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { ToggleProps } from "./Component.types";
import { styles } from "./Component.styles";
import { Switch } from "../Switch";

export const Toggle: React.FC<ToggleProps> = ({ value, onValueChange, label }) => {
  return (
    <TouchableOpacity
      activeOpacity={1.0}
      onPress={() => onValueChange(!value)}
      style={styles.container}
    >
      <Switch value={value} onValueChange={onValueChange} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};