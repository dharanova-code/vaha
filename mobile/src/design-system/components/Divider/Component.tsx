import React from "react";
import { View } from "react-native";
import { DividerProps } from "./Component.types";
import { styles } from "./Component.styles";

export const Divider: React.FC<DividerProps> = ({ style }) => {
  return <View style={[styles.line, style]} />;
};