import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.space4,
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.accent.primary,
    backgroundColor: "transparent",
    marginBottom: theme.spacing.space4,
  },
  quote: {
    fontFamily: theme.typography.fonts.serif,
    fontSize: theme.typography.sizes.bodyMd,
    lineHeight: theme.typography.lineHeights.bodyMd,
    color: theme.colors.text.primary,
    fontStyle: "italic",
  },
  meta: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.metaSm,
    color: theme.colors.text.muted,
    marginTop: theme.spacing.space2,
  },
});