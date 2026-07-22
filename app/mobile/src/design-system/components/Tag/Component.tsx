import React from "react";
import { View, Text } from "react-native";
import { TagProps } from "./Component.types";
import { styles } from "./Component.styles";

export const Tag: React.FC<TagProps> = ({ label, variant = "neutral" }) => {
  return (
    <View style={[styles.tag, variant !== "neutral" && styles[variant]]}>
      <Text style={styles.text}>{label.toUpperCase()}</Text>
    </View>
  );
};