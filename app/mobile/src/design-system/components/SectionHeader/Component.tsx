import React from "react";
import { View, Text } from "react-native";
import { SectionHeaderProps } from "./Component.types";
import { styles } from "./Component.styles";

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};