import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CaptureDetailsModal() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Capture Details Modal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F5",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1B3629",
  },
});
