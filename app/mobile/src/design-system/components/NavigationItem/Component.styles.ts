import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  item: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  label: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: 10,
    marginTop: 4,
    color: theme.colors.text.muted,
  },
  labelActive: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.semibold,
  },
});