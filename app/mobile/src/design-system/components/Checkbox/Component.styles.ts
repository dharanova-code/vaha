import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.space1,
  },
  box: {
    height: 20,
    width: 20,
    borderRadius: theme.radius.small,
    borderWidth: 1,
    borderColor: theme.colors.accent.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  checkedBox: {
    backgroundColor: theme.colors.text.primary,
    borderColor: theme.colors.text.primary,
  },
  label: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.bodyMd,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.space3,
  },
});