import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.accent.border,
  },
  label: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.bodyMd,
    color: theme.colors.text.primary,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.metaSm,
    color: theme.colors.text.muted,
    marginRight: 8,
  },
});