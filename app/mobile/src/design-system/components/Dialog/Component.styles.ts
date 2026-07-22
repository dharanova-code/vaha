import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.space6,
  },
  dialog: {
    width: "100%",
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 2,
    borderColor: theme.colors.accent.border,
    borderRadius: theme.radius.medium,
    padding: theme.spacing.space6,
  },
  title: {
    fontFamily: theme.typography.fonts.serif,
    fontSize: theme.typography.sizes.headlineLg,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.space2,
  },
  message: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.bodyMd,
    color: theme.colors.text.muted,
    marginBottom: theme.spacing.space6,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: theme.spacing.space3,
  },
});