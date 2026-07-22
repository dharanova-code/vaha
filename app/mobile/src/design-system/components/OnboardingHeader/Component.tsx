import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { theme } from "../../theme/tokens";

export interface OnboardingHeaderProps {
  /** Title always rendered absolutely centered regardless of side action widths. */
  title: string | undefined;
  /** Optional left action (e.g. back button). Rendered in a fixed-width 44pt zone. */
  leftAction?: React.ReactNode;
  /** Optional right action (e.g. Skip). Rendered in a fixed-width 44pt zone. */
  rightAction?: React.ReactNode;
  style?: ViewStyle;
}

/**
 * OnboardingHeader
 *
 * The title is positioned absolutely, stretching full container width,
 * so it remains mathematically centered at all times — independent of
 * whether a back button, skip button, or neither is present.
 *
 * Side actions live in fixed 44pt zones that never influence title position.
 */
export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  title,
  leftAction,
  rightAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Side slots: fixed width so they never influence center calculation */}
      <View style={styles.sideSlot}>{leftAction ?? null}</View>

      {/* Spacer fills the center pushing sides apart — title floats above via absolute */}
      <View style={styles.spacer} />

      <View style={styles.sideSlot}>{rightAction ?? null}</View>

      {/* Absolute title layer: zero dependency on sibling widths */}
      <View style={styles.titleOverlay} pointerEvents="none">
        <Text style={styles.titleText} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.layout.mobileMargin,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.accent.border,
  },
  /**
   * Fixed-width side zones. 44pt is the minimum Apple/Material recommended
   * touch target. The actual button inside may be smaller but the zone is stable.
   */
  sideSlot: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  spacer: {
    flex: 1,
  },
  /**
   * Absolutely positioned title fills full container width (minus outer padding).
   * pointerEvents="none" ensures taps pass through to side buttons.
   */
  titleOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontFamily: theme.typography.fonts.serif,
    fontSize: theme.typography.sizes.headlineLg,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.semibold,
    textAlign: "center",
  },
});
