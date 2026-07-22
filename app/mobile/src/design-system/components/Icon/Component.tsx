import React from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { IconProps } from "./Component.types";
import { styles } from "./Component.styles";
import { theme } from "../../theme/tokens";

export const Icon: React.FC<IconProps> = ({
  name,
  color = theme.colors.text.primary,
  size = "standard",
  accessibilityLabel,
}) => {
  const pixelSize = typeof size === "number" 
    ? size 
    : size === "small" 
      ? 16 
      : size === "large" 
        ? 32 
        : 24;

  const sizeStyle = typeof size === "string" ? styles[size] : { width: size, height: size };

  return (
    <View
      style={[styles.container, sizeStyle]}
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel || `${name} icon`}
    >
      <Feather name={name} size={pixelSize} color={color} />
    </View>
  );
};
