import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: theme.spacing.space3,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.accent.border,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.radius.small,
    paddingHorizontal: theme.spacing.space3,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.bodyMd,
  },
  errorInput: {
    borderColor: theme.colors.semantic.error,
  },
  errorText: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.metaSm,
    color: theme.colors.semantic.error,
    marginTop: 4,
  },
});