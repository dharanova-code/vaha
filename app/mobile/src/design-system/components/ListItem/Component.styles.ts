import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.space3,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.accent.border,
  },
  content: {
    flex: 1,
    marginRight: theme.spacing.space4,
  },
  title: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.bodyMd,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.metaSm,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
});