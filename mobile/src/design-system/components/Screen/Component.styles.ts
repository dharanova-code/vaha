import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.layout.mobileMargin,
  },
  scrollContent: {
    paddingHorizontal: theme.layout.mobileMargin,
  },
  marginThread: {
    position: "absolute",
    left: theme.layout.mobileMargin,
    top: 0,
    bottom: 0,
    width: 0.5,
    backgroundColor: theme.colors.text.muted,
    opacity: 0.15,
  },
});