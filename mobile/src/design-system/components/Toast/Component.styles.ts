import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.accent.primary,
    borderRadius: theme.radius.small,
    paddingHorizontal: theme.spacing.space4,
    paddingVertical: theme.spacing.space2,
    zIndex: theme.zIndex.toast,
  },
  text: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.labelSm,
    color: theme.colors.text.primary,
  },
});