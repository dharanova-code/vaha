import React from "react";
import { View, ScrollView, SafeAreaView } from "react-native";
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
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.container, styles.content, style]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {withMarginThread && <View style={styles.marginThread} pointerEvents="none" />}
      {content}
    </SafeAreaView>
  );
};