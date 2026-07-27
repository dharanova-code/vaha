import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  header: {
    paddingVertical: theme.spacing.space3,
  },
  text: {
    fontFamily: theme.typography.fonts.serif,
    fontSize: theme.typography.sizes.headlineLg,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.semibold,
  },
});