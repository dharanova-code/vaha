import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { CollectionCardProps } from "./Component.types";
import { styles } from "./Component.styles";
import { theme } from "../../theme/tokens";

export const CollectionCard: React.FC<CollectionCardProps> = ({ name, count, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={theme.opacity.active}
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.count}>{count} ITEMS</Text>
    </TouchableOpacity>
  );
};