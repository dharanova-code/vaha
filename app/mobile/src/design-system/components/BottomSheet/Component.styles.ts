import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: theme.zIndex.overlay,
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.accent.border,
    borderTopLeftRadius: theme.radius.medium,
    borderTopRightRadius: theme.radius.medium,
    padding: theme.spacing.space6,
    zIndex: theme.zIndex.modal,
  },
});