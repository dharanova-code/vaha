import React from "react";
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = insets.bottom || 8;
  const tabBarHeight = 56 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1B3629",
        tabBarInactiveTintColor: "#7A7265",
        tabBarStyle: {
          backgroundColor: "#FAF8F5",
          borderTopColor: "rgba(122, 114, 101, 0.15)",
          height: tabBarHeight,
          paddingBottom: bottomPadding,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginBottom: 0,
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
          title: "My Notes",
          tabBarIcon: ({ color, size }) => <Feather name="mic" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="device"
        options={{
          title: "My Device",
          tabBarIcon: ({ color, size }) => <Feather name="box" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="insights/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
