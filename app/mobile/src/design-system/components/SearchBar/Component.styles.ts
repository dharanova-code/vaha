import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.accent.border,
    paddingHorizontal: theme.spacing.space2,
  },
  input: {
    flex: 1,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.bodyMd,
    marginLeft: theme.spacing.space2,
  },
});