import React from "react";
import { View } from "react-native";
import { TabBarProps } from "./Component.types";
import { styles } from "./Component.styles";

export const TabBar: React.FC<TabBarProps> = ({ children }) => {
  return <View style={styles.bar}>{children}</View>;
};