import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  snackbar: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: theme.colors.text.primary,
    borderRadius: theme.radius.small,
    padding: theme.spacing.space3,
    zIndex: theme.zIndex.toast,
  },
  text: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.bodyMd,
    color: theme.colors.background.primary,
  },
});