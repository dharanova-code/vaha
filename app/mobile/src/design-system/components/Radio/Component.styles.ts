import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.space2,
  },
  outerCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.accent.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  selectedOuterCircle: {
    borderColor: theme.colors.text.primary,
  },
  innerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.text.primary,
  },
  label: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.bodyMd,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.space3,
  },
});