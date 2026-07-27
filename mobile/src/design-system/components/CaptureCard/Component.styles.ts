import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.space4,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.accent.border,
    marginBottom: theme.spacing.space3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: theme.typography.fonts.serif,
    fontSize: theme.typography.sizes.headlineLg,
    color: theme.colors.text.primary,
  },
  time: {
    fontFamily: theme.typography.fonts.mono,
    fontSize: theme.typography.sizes.metaSm,
    color: theme.colors.text.muted,
  },
  excerpt: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.bodyMd,
    color: theme.colors.text.muted,
    marginTop: theme.spacing.space2,
  },
});