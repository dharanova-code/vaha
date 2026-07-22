import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  badge: {
    height: 18,
    minWidth: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.accent.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.accent.primary,
    paddingHorizontal: 0,
  },
  text: {
    color: theme.colors.background.primary,
    fontSize: 10,
    fontWeight: theme.typography.weights.bold,
  },
});