import React from "react";
import { Stack } from "expo-router";

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "modal",
      }}
    />
  );
}
