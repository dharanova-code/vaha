import React from "react";
import { Stack } from "expo-router";

export default function SettingsStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FAF8F5",
        },
        headerTintColor: "#1B3629",
      }}
    />
  );
}
