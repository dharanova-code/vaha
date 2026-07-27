import React from "react";
import { View, TextInput, Text } from "react-native";
import { InputProps } from "./Component.types";
import { styles } from "./Component.styles";
import { theme } from "../../theme/tokens";

export const Input: React.FC<InputProps> = ({ error, style, ...rest }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, !!error && styles.errorInput, style]}
        placeholderTextColor={theme.colors.text.muted}
        {...rest}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};