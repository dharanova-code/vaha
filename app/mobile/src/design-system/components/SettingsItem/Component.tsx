import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { SettingsItemProps } from "./Component.types";
import { styles } from "./Component.styles";
import { Icon, IconRegistry } from "../Icon";

export const SettingsItem: React.FC<SettingsItemProps> = ({ label, value, rightElement, onPress }) => {
  const content = (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.right}>
        {value && <Text style={styles.value}>{value}</Text>}
        {rightElement}
        {onPress && (
          <View style={{ transform: [{ rotate: "180deg" }] }}>
            <Icon name={IconRegistry.back} size="small" />
          </View>
        )}
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.item}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.item}>{content}</View>;
};
