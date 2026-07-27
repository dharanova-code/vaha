import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  button: {
    height: 48,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.space4,
    borderWidth: 1,
    borderRadius: theme.radius.small,
  },
  primary: {
    backgroundColor: theme.colors.text.primary,
    borderColor: theme.colors.text.primary,
  },
  secondary: {
    backgroundColor: "transparent",
    borderColor: theme.colors.accent.border,
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: theme.colors.text.primary,
  },
  danger: {
    backgroundColor: "transparent",
    borderColor: theme.colors.semantic.error,
  },
  disabled: {
    opacity: theme.opacity.disabled,
  },
  text: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.bodyMd,
    fontWeight: theme.typography.weights.semibold,
  },
  textPrimary: {
    color: theme.colors.background.primary,
  },
  textSecondary: {
    color: theme.colors.text.primary,
  },
  textGhost: {
    color: theme.colors.text.primary,
  },
  textOutline: {
    color: theme.colors.text.primary,
  },
  textDanger: {
    color: theme.colors.semantic.error,
  },
});