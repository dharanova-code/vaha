import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    height: 60,
    backgroundColor: theme.colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.accent.border,
    alignItems: "center",
    justifyContent: "space-around",
  },
});