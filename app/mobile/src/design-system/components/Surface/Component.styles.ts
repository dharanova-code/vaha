import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  surface: {
    padding: theme.spacing.space4,
  },
  primary: {
    backgroundColor: theme.colors.background.primary,
  },
  secondary: {
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.accent.border,
    borderRadius: theme.radius.medium,
  },
});