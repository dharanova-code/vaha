import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { CaptureCardProps } from "./Component.types";
import { styles } from "./Component.styles";
import { theme } from "../../theme/tokens";
import { Feather } from "@expo/vector-icons";

export const CaptureCard: React.FC<CaptureCardProps> = ({
  title,
  excerpt,
  timestamp,
  duration,
  onPress,
  onLongPress,
  selected = false,
  selectionModeActive = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={theme.opacity.active}
      style={[
        styles.card,
        selected && { borderColor: theme.colors.accent.primary, backgroundColor: "#F7EFE9" },
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={400}
      accessibilityRole="button"
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {selectionModeActive && (
          <View style={{ marginRight: 12 }}>
            {selected ? (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: theme.colors.accent.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="check" size={12} color="#FFF" />
              </View>
            ) : (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: theme.colors.accent.border,
                  backgroundColor: "transparent",
                }}
              />
            )}
          </View>
        )}

        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <Text style={styles.time}>{timestamp}{duration ? " (" + duration + ")" : ""}</Text>
          </View>
          <Text style={styles.excerpt} numberOfLines={2}>{excerpt}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};