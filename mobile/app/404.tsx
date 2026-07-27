import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Page Not Found</Text>
      <Text style={styles.text}>The requested screen does not exist.</Text>
      <Link href="/(tabs)/home" style={styles.link}>
        Go to Home
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1B3629",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: "#7A7265",
    marginBottom: 24,
  },
  link: {
    fontSize: 16,
    color: "#C07D53",
    fontWeight: "600",
  },
});
