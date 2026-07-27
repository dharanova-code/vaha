import React from "react";
import { TouchableOpacity, View } from "react-native";
import { CardProps } from "./Component.types";
import { styles } from "./Component.styles";
import { theme } from "../../theme/tokens";

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  variant = "default",
}) => {
  const isInteractive = variant === "interactive" || !!onPress;

  if (isInteractive && onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={theme.opacity.active}
        style={[styles.card, variant === "outlined" && styles.outlined, style]}
        accessible={true}
        accessibilityRole="button"
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, variant === "outlined" && styles.outlined, variant === "interactive" && styles.interactive, style]}>
      {children}
    </View>
  );
};