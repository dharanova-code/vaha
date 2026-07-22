import React, { useEffect, useRef } from "react";
import { View, ActivityIndicator, Animated } from "react-native";
import { LoadingProps } from "./Component.types";
import { styles } from "./Component.styles";
import { theme } from "../../theme/tokens";

export const Loading: React.FC<LoadingProps> = ({ variant = "circular" }) => {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (variant.startsWith("skeleton")) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.0, duration: 1250, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0.4, duration: 1250, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [variant, pulseAnim]);

  if (variant === "circular") {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.accent.primary} />
      </View>
    );
  }

  if (variant === "skeleton-card") {
    return (
      <Animated.View style={[styles.skeletonCard, { opacity: pulseAnim }]}>
        <View style={[styles.skeletonText, { width: "40%", margin: 16 }]} />
        <View style={[styles.skeletonText, { width: "80%", marginHorizontal: 16 }]} />
      </Animated.View>
    );
  }

  return (
    <View style={{ width: "100%" }}>
      <Loading variant="skeleton-card" />
      <Loading variant="skeleton-card" />
    </View>
  );
};