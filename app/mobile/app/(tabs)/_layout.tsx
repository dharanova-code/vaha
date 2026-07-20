import React from "react";
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";

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
          tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="captures/index"
        options={{
          title: "Library",
          tabBarIcon: ({ color, size }) => <Feather name="mic" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="insights/index"
        options={{
          title: "Insights",
          tabBarIcon: ({ color, size }) => <Feather name="bar-chart-2" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="device/index"
        options={{
          title: "Device",
          tabBarIcon: ({ color, size }) => <Feather name="cpu" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Feather name="settings" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
