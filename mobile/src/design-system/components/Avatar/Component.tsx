import React from "react";
import { View, Text, Image } from "react-native";
import { AvatarProps } from "./Component.types";
import { styles } from "./Component.styles";

export const Avatar: React.FC<AvatarProps> = ({ initials = "V", imageUri, size = 40 }) => {
  if (imageUri) {
    return (
      <Image
        source={{ uri: imageUri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.text, { fontSize: size * 0.4 }]}>{(initials || "V").slice(0, 2).toUpperCase()}</Text>
    </View>
  );
};