import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { NavigationItemProps } from "./Component.types";
import { styles } from "./Component.styles";
import { Icon, IconRegistry } from "../Icon";
import { theme } from "../../theme/tokens";

export const NavigationItem: React.FC<NavigationItemProps> = ({ label, icon, active, onPress }) => {
  const rawFeatherName = IconRegistry[icon];
  return (
    <TouchableOpacity
      activeOpacity={theme.opacity.active}
      style={styles.item}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Icon name={rawFeatherName} size="small" color={active ? theme.colors.text.primary : theme.colors.text.muted} />
      <Text style={[styles.label, active && styles.labelActive]}>{label.toUpperCase()}</Text>
    </TouchableOpacity>
  );
};
