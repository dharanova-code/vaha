import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { ApplicationBootstrap } from "../src/core/bootstrap/ApplicationBootstrap";
import { RuntimeState } from "../src/core/runtime/RuntimeState";
import { AppLifecycle } from "../src/core/runtime/AppLifecycle";
import { ConsoleLogger } from "../src/core/logger/Logger";

export default function AppEntry() {
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    const logger = new ConsoleLogger();
    const lifecycle = new AppLifecycle(logger);
    lifecycle.startListening();

    let isMounted = true;

    async function init() {
      try {
        const result = await ApplicationBootstrap.getInstance().run();
        if (!isMounted) return;

        if (result.success) {
          setStatus("ready");
          setDuration(result.durationMs);
        } else {
          setStatus("failed");
          setErrorMsg(result.error?.message ?? "Unknown bootstrap error");
        }
      } catch (err) {
        if (!isMounted) return;
        setStatus("failed");
        setErrorMsg(err instanceof Error ? err.message : String(err));
      }
    }

    init();

    return () => {
      isMounted = false;
      lifecycle.stopListening();
    };
  }, []);

  if (status === "loading") {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1B3629" />
        <Text style={styles.text}>Initializing VAHA Runtime...</Text>
      </View>
    );
  }

  if (status === "failed") {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={[styles.text, styles.errorText]}>VAHA Initialization Failed</Text>
        <Text style={styles.subText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VAHA Runtime Ready</Text>
      <Text style={styles.subText}>Startup completed successfully in {duration}ms</Text>
      <Text style={styles.subText}>Environment: {RuntimeState.getInstance().getEnvironment()}</Text>
      <Text style={styles.subText}>Version: {RuntimeState.getInstance().getAppVersion()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F5",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorContainer: {
    backgroundColor: "#FFF5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1B3629",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: "#1B3629",
    marginTop: 16,
  },
  errorText: {
    color: "#C53030",
    fontWeight: "bold",
  },
  subText: {
    fontSize: 14,
    color: "#7A7265",
    marginTop: 8,
    textAlign: "center",
  },
});
