import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { SnackbarProps } from "./Component.types";
import { styles } from "./Component.styles";

export const Snackbar: React.FC<SnackbarProps> = ({ visible, message, onDismiss }) => {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [visible, onDismiss]);

  if (!visible) return null;

  return (
    <View style={styles.snackbar}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};