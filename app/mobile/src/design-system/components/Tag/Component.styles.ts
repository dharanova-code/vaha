import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: theme.spacing.space2,
    paddingVertical: 2,
    borderRadius: theme.radius.small,
    borderWidth: 1,
    borderColor: theme.colors.accent.border,
    alignSelf: "flex-start",
  },
  text: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: 11,
    color: theme.colors.text.muted,
  },
  success: {
    borderColor: theme.colors.semantic.success,
  },
  error: {
    borderColor: theme.colors.semantic.error,
  },
  warning: {
    borderColor: theme.colors.semantic.warning,
  },
  info: {
    borderColor: theme.colors.semantic.info,
  },
});