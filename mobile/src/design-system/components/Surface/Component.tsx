import React from "react";
import { View } from "react-native";
import { SurfaceProps } from "./Component.types";
import { styles } from "./Component.styles";

export const Surface: React.FC<SurfaceProps> = ({
  children,
  level = "primary",
  style,
}) => {
  return (
    <View style={[styles.surface, styles[level], style]}>
      {children}
    </View>
  );
};