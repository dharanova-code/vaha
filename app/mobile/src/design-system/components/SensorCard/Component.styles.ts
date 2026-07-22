import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  card: {
    width: 140,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.accent.border,
    borderRadius: theme.radius.medium,
    padding: theme.spacing.space3,
  },
  label: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.metaSm,
    color: theme.colors.text.muted,
  },
  value: {
    fontFamily: theme.typography.fonts.mono,
    fontSize: theme.typography.sizes.headlineLg,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.space1,
  },
  unit: {
    fontSize: theme.typography.sizes.metaSm,
    color: theme.colors.text.muted,
  },
  warning: {
    borderColor: theme.colors.semantic.warning,
  },
  alert: {
    borderColor: theme.colors.semantic.error,
  },
});