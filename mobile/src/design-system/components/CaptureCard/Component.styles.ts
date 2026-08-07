import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  card: {
    padding: 18,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.accent.border,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 12,
  },
  title: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text.primary,
    flex: 1,
  },
  time: {
    fontFamily: theme.typography.fonts.mono,
    fontSize: 12,
    color: theme.colors.text.muted,
  },
  excerpt: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: 14,
    color: theme.colors.text.muted,
    lineHeight: 21,
    marginTop: 4,
  },
});