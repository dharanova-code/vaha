import React from "react";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1B3629",
        tabBarInactiveTintColor: "#7A7265",
        tabBarStyle: {
          backgroundColor: "#FAF8F5",
          borderTopColor: "rgba(122, 114, 101, 0.15)",
        },
        headerStyle: {
          backgroundColor: "#FAF8F5",
          borderBottomColor: "rgba(122, 114, 101, 0.15)",
        },
        headerTintColor: "#1B3629",
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="captures/index"
        options={{
          title: "Library",
        }}
      />
      <Tabs.Screen
        name="insights/index"
        options={{
          title: "Insights",
        }}
      />
      <Tabs.Screen
        name="device/index"
        options={{
          title: "Device",
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: "Settings",
        }}
      />
    </Tabs>
  );
}
