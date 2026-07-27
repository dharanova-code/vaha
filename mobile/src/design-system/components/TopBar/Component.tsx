import React from "react";
import { View, Text } from "react-native";
import { TopBarProps } from "./Component.types";
import { styles } from "./Component.styles";

export const TopBar: React.FC<TopBarProps> = ({ title, leftAction, rightAction }) => {
  return (
    <View style={styles.bar}>
      {leftAction || <View style={{ width: 24 }} />}
      <Text style={styles.title}>{title}</Text>
      {rightAction || <View style={{ width: 24 }} />}
    </View>
  );
};