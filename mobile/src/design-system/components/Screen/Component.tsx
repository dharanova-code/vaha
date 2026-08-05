import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenProps } from "./Component.types";
import { styles } from "./Component.styles";

export const Screen: React.FC<ScreenProps> = ({
  children,
  scrollable = false,
  style,
  withMarginThread = false,
  refreshControl,
}) => {
  const content = scrollable ? (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, style]}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.container, styles.content, style]}>
      {children}
    </View>
  );

  return (
    // Only top/left/right — bottom is handled by tab bar or modal chrome
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {withMarginThread && <View style={styles.marginThread} pointerEvents="none" />}
      {content}
    </SafeAreaView>
  );
};