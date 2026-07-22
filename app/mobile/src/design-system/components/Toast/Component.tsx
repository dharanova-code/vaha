import React from "react";
import { View, Text } from "react-native";
import { ToastProps } from "./Component.types";
import { styles } from "./Component.styles";

export const Toast: React.FC<ToastProps> = ({ visible, message }) => {
  if (!visible) return null;

  return (
    <View style={styles.toast}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};