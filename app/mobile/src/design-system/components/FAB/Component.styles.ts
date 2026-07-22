import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  fab: {
    height: 48,
    borderRadius: theme.radius.small,
    borderWidth: 1,
    borderColor: theme.colors.text.primary,
    backgroundColor: theme.colors.background.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.space4,
  },
  text: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.bodyMd,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.semibold,
  },
});