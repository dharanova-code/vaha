import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.space4,
    borderRadius: theme.radius.medium,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.accent.border,
  },
  outlined: {
    backgroundColor: "transparent",
  },
  interactive: {
    borderColor: theme.colors.accent.primary,
  },
});