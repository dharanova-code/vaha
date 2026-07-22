import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.space8,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: theme.typography.fonts.serif,
    fontSize: theme.typography.sizes.headlineLg,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.space4,
    marginBottom: theme.spacing.space2,
  },
  message: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.bodyMd,
    color: theme.colors.text.muted,
    textAlign: "center",
  },
});