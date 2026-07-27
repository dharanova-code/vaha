import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: theme.spacing.space3,
    paddingVertical: theme.spacing.space1,
    borderRadius: theme.radius.small,
    borderWidth: 1,
    borderColor: theme.colors.accent.border,
    alignSelf: "flex-start",
    backgroundColor: "transparent",
  },
  selected: {
    backgroundColor: theme.colors.text.primary,
    borderColor: theme.colors.text.primary,
  },
  text: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.metaSm,
    color: theme.colors.text.primary,
  },
  textSelected: {
    color: theme.colors.background.primary,
  },
});