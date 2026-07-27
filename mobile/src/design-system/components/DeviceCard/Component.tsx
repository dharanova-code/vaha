import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { DeviceCardProps } from "./Component.types";
import { styles } from "./Component.styles";
import { theme } from "../../theme/tokens";

export const DeviceCard: React.FC<DeviceCardProps> = ({ name, status, batteryLevel, onPress }) => {
  const content = (
    <>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        {batteryLevel !== undefined && (
          <Text style={styles.statusText}>{batteryLevel}% BATTERY</Text>
        )}
      </View>
      <View style={styles.statusRow}>
        <View style={[styles.dot, status === "connected" && styles.connectedDot, status === "connecting" && styles.connectingDot]} />
        <Text style={styles.statusText}>{status.toUpperCase()}</Text>
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={theme.opacity.active} style={styles.card}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.card}>{content}</View>;
};
