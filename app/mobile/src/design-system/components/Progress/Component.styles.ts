import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  track: {
    height: 4,
    width: "100%",
    backgroundColor: theme.colors.accent.border,
    borderRadius: theme.radius.small,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    backgroundColor: theme.colors.accent.primary,
  },
});