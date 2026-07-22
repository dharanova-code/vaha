import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  avatar: {
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.text.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: theme.typography.fonts.sans,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.semibold,
  },
});