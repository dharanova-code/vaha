import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { CheckboxProps } from "./Component.types";
import { styles } from "./Component.styles";
import { Icon, IconRegistry } from "../Icon";
import { theme } from "../../theme/tokens";

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label }) => {
  return (
    <TouchableOpacity
      activeOpacity={theme.opacity.active}
      style={styles.container}
      onPress={() => onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View style={[styles.box, checked && styles.checkedBox]}>
        {checked && <Icon name={IconRegistry.close} size={14} color={theme.colors.background.primary} />}
      </View>
      {!!label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};
