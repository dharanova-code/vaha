import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.space4,
  },
  skeletonCard: {
    height: 100,
    width: "100%",
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.radius.medium,
    marginBottom: theme.spacing.space3,
    opacity: 0.6,
  },
  skeletonText: {
    height: 16,
    backgroundColor: theme.colors.accent.border,
    borderRadius: theme.radius.small,
    marginBottom: theme.spacing.space2,
  },
});