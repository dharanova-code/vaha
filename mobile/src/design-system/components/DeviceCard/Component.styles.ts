import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.space4,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.accent.border,
    borderRadius: theme.radius.medium,
    marginBottom: theme.spacing.space3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.bodyMd,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.medium,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.space2,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.text.muted,
    marginRight: 6,
  },
  connectedDot: {
    backgroundColor: theme.colors.semantic.success,
  },
  connectingDot: {
    backgroundColor: theme.colors.semantic.warning,
  },
  statusText: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.metaSm,
    color: theme.colors.text.muted,
  },
});