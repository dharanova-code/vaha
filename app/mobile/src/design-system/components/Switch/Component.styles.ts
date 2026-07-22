import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 24,
    borderRadius: theme.radius.small,
    borderWidth: 1,
    borderColor: theme.colors.accent.border,
    padding: 2,
    justifyContent: "center",
  },
  trackActive: {
    backgroundColor: theme.colors.text.primary,
    borderColor: theme.colors.text.primary,
  },
  thumb: {
    width: 18,
    height: 18,
    borderRadius: theme.radius.small - 1,
    backgroundColor: theme.colors.text.muted,
  },
  thumbActive: {
    backgroundColor: theme.colors.background.primary,
    transform: [{ translateX: 20 }],
  },
});