import { StyleSheet } from "react-native";
import { theme } from "../../theme/tokens";

export const styles = StyleSheet.create({
  "display-lg": {
    fontFamily: theme.typography.fonts.serif,
    fontSize: theme.typography.sizes.displayLg,
    lineHeight: theme.typography.lineHeights.displayLg,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: -0.72,
  },
  "headline-lg": {
    fontFamily: theme.typography.fonts.serif,
    fontSize: theme.typography.sizes.headlineLg,
    lineHeight: theme.typography.lineHeights.headlineLg,
    fontWeight: theme.typography.weights.semibold,
    letterSpacing: -0.24,
  },
  "body-md": {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.bodyMd,
    lineHeight: theme.typography.lineHeights.bodyMd,
    fontWeight: theme.typography.weights.regular,
  },
  "label-sm": {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.labelSm,
    lineHeight: theme.typography.lineHeights.labelSm,
    fontWeight: theme.typography.weights.medium,
  },
  "meta-sm": {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.metaSm,
    lineHeight: theme.typography.lineHeights.metaSm,
    fontWeight: theme.typography.weights.regular,
  },
  "mono-bold": {
    fontFamily: theme.typography.fonts.mono,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: theme.typography.weights.bold,
  },
  "mono-reg": {
    fontFamily: theme.typography.fonts.mono,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: theme.typography.weights.regular,
  },
});
