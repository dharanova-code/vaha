import React from "react";
import { View, Text } from "react-native";
import { AvatarProps } from "./Component.types";
import { styles } from "./Component.styles";

export const Avatar: React.FC<AvatarProps> = ({ initials, size = 40 }) => {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.text, { fontSize: size * 0.4 }]}>{initials.slice(0, 2).toUpperCase()}</Text>
    </View>
  );
};