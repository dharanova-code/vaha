import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  bar: {
    height: 56,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.layout.mobileMargin,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.accent.border,
  },
  title: {
    fontFamily: theme.typography.fonts.serif,
    fontSize: theme.typography.sizes.headlineLg,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.semibold,
  },
});