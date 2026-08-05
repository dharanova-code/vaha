import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { ButtonProps } from "./Component.types";
import { styles } from "./Component.styles";
import { theme } from "../../theme/tokens";

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
  accessibilityLabel,
}) => {
  const getTextColorStyle = () => {
    switch (variant) {
      case "primary": return styles.textPrimary;
      case "danger": return styles.textDanger;
      default: return styles.textSecondary;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        styles[variant],
        (disabled || loading) && styles.disabled,
        style,
      ]}
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: loading }}
      accessibilityLabel={accessibilityLabel || (typeof children === "string" ? children : "button")}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === "primary" ? theme.colors.background.primary : theme.colors.text.primary} 
        />
      ) : typeof children === "string" ? (
        <Text style={[styles.text, getTextColorStyle()]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};