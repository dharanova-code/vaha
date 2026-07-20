import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Slot, SplashScreen } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { ApplicationBootstrap } from "../src/core/bootstrap/ApplicationBootstrap";
import { AppError } from "../src/core/errors/AppError";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [bootstrapStatus, setBootstrapStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function runBootstrap() {
      try {
        const result = await ApplicationBootstrap.getInstance().run();
        if (!isMounted) return;

        if (result.success) {
          setBootstrapStatus("ready");
        } else {
          setBootstrapStatus("failed");
          setError(result.error ?? new AppError("Unknown bootstrap error"));
        }
      } catch (err) {
        if (!isMounted) return;
        setBootstrapStatus("failed");
        setError(new AppError("Fatal error during bootstrap", "FATAL_BOOTSTRAP", err));
      } finally {
        if (isMounted) {
          await SplashScreen.hideAsync().catch(() => {});
        }
      }
    }
    runBootstrap();
    return () => {
      isMounted = false;
    };
  }, []);

  if (bootstrapStatus === "loading") {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1B3629" />
        <Text style={styles.loadingText}>VAHA Initializing...</Text>
      </View>
    );
  }

  if (bootstrapStatus === "failed") {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>VAHA Startup Failed</Text>
        <Text style={styles.errorMessage}>{error?.message ?? "An unexpected error occurred during startup."}</Text>
        <Text style={styles.errorSub}>Please restart the application.</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Slot />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#FAF8F5",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 16,
    color: "#1B3629",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#FFF5F5",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#C53030",
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 15,
    color: "#7A7265",
    textAlign: "center",
    marginBottom: 16,
  },
  errorSub: {
    fontSize: 13,
    color: "#7A7265",
  },
  retryText: {
    fontSize: 14,
    color: "#C07D53",
    fontWeight: "bold",
    marginTop: 8,
  },
});

export { ErrorBoundary } from "expo-router";

