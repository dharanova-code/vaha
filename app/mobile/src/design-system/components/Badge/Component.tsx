import React from "react";
import { View, Text } from "react-native";
import { BadgeProps } from "./Component.types";
import { styles } from "./Component.styles";

export const Badge: React.FC<BadgeProps> = ({ count, variant = "count" }) => {
  if (variant === "dot") {
    return <View style={styles.dot} />;
  }

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{count}</Text>
    </View>
  );
};