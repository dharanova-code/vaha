import React from "react";
import { View, Text } from "react-native";
import { EmptyStateProps } from "./Component.types";
import { styles } from "./Component.styles";
import { Icon, IconRegistry } from "../Icon";
import { theme } from "../../theme/tokens";

export const EmptyState: React.FC<EmptyStateProps> = ({ variant, title, message }) => {
  const getVariantData = () => {
    switch (variant) {
      case "captures": return { icon: "record" as const, t: "No Captures Yet", m: "Start capturing thoughts on your Vaha device." };
      case "devices": return { icon: "device" as const, t: "No Connected Devices", m: "Pair a new companion device in your settings." };
      case "insights": return { icon: "insights" as const, t: "No Insights Yet", m: "Record more thoughts to build reflection links." };
      case "collections": return { icon: "folder" as const, t: "No Collections", m: "Create folder collections to categorize memories." };
      case "search": return { icon: "search" as const, t: "No Search Results", m: "Try searching for another keyword or topic." };
    }
  };

  const data = getVariantData();
  const rawFeatherName = IconRegistry[data.icon];

  return (
    <View style={styles.container}>
      <Icon name={rawFeatherName} size={32} color={theme.colors.text.muted} />
      <Text style={styles.title}>{title || data.t}</Text>
      <Text style={styles.message}>{message || data.m}</Text>
    </View>
  );
};
