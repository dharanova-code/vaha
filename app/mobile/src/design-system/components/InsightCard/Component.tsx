import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { InsightCardProps } from "./Component.types";
import { styles } from "./Component.styles";

export const InsightCard: React.FC<InsightCardProps> = ({ quote, sourceTitle, timestamp, onPress }) => {
  const content = (
    <>
      <Text style={styles.quote}>“{quote}”</Text>
      <Text style={styles.meta}>{sourceTitle.toUpperCase()} • {timestamp}</Text>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.card}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.card}>{content}</View>;
};
