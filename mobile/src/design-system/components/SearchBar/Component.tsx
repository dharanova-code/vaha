import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { SearchBarProps } from "./Component.types";
import { styles } from "./Component.styles";
import { Icon, IconRegistry } from "../Icon";
import { theme } from "../../theme/tokens";

export const SearchBar: React.FC<SearchBarProps> = ({ onClear, value, style, ...rest }) => {
  return (
    <View style={styles.container}>
      <Icon name={IconRegistry.search} size="small" color={theme.colors.text.muted} />
      <TextInput
        style={[styles.input, style]}
        placeholder="Find a thread of thought..."
        placeholderTextColor={theme.colors.text.muted}
        value={value}
        {...rest}
      />
      {!!value && onClear && (
        <TouchableOpacity onPress={onClear}>
          <Icon name={IconRegistry.close} size="small" color={theme.colors.text.muted} />
        </TouchableOpacity>
      )}
    </View>
  );
};
