import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.space4,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.accent.border,
    borderRadius: theme.radius.medium,
    marginBottom: theme.spacing.space3,
  },
  name: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.bodyMd,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.medium,
  },
  count: {
    fontFamily: theme.typography.fonts.mono,
    fontSize: theme.typography.sizes.labelSm,
    color: theme.colors.text.muted,
  },
});