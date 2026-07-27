import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { ListItemProps } from "./Component.types";
import { styles } from "./Component.styles";

export const ListItem: React.FC<ListItemProps> = ({ title, subtitle, rightElement, onPress }) => {
  const content = (
    <>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {rightElement}
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
