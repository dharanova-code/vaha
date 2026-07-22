import React from "react";
import EntryRedirect from "../../app/index";
import HomeScreen from "../../app/(tabs)/home/index";
import CapturesScreen from "../../app/(tabs)/captures/index";
import InsightsScreen from "../../app/(tabs)/insights/index";
import DeviceScreen from "../../app/(tabs)/device/index";
import SettingsScreen from "../../app/(tabs)/settings/index";
import CaptureDetailsModal from "../../app/(modals)/capture-details";
import NotFoundScreen from "../../app/404";
import { AuthGuardPlaceholder } from "../../src/core/navigation/NavigationGuard";

// Mock react-native completely to avoid mock constructor issues in SDK 54/RN 0.81
// The issue is that jest.requireActual('react-native') spreads mocked components
// (ActivityIndicator, Text, etc.) that fail with constructor errors in this version.
jest.mock("react-native", () => {
  const mockReact = require("react");
  const createElement = (tag: string) => ({ children }: { children?: unknown }) =>
    mockReact.createElement(tag, null, children);
  return {
    StyleSheet: {
      create: (styles: Record<string, unknown>) => styles,
      flatten: (style: unknown) => style,
      hairlineWidth: 1,
    },
    View: createElement("view"),
    Text: createElement("text"),
    TouchableOpacity: createElement("touchableopacity"),
    Pressable: createElement("pressable"),
    ScrollView: createElement("scrollview"),
    FlatList: createElement("flatlist"),
    Image: createElement("image"),
    Platform: { OS: "android", select: (objs: Record<string, unknown>) => objs.android ?? objs.default },
    Dimensions: { get: () => ({ width: 375, height: 812 }) },
    Animated: {
      View: createElement("animated-view"),
      Text: createElement("animated-text"),
      Value: jest.fn(() => ({ interpolate: jest.fn(), setValue: jest.fn() })),
      timing: jest.fn(() => ({ start: jest.fn() })),
      spring: jest.fn(() => ({ start: jest.fn() })),
      createAnimatedComponent: (c: unknown) => c,
    },
    useColorScheme: jest.fn(() => "light"),
    useWindowDimensions: jest.fn(() => ({ width: 375, height: 812, scale: 1, fontScale: 1 })),
  };
});

// Mock dependencies
jest.mock("expo-router", () => {
  return {
    Redirect: () => null,
    Link: () => null,
    Slot: () => null,
    useLocalSearchParams: () => ({ uuid: "123" }),
    Tabs: {
      Screen: () => null,
    },
    Stack: {
      Screen: () => null,
    },
    SplashScreen: {
      preventAutoHideAsync: jest.fn(() => Promise.resolve(true)),
      hideAsync: jest.fn(() => Promise.resolve(true)),
    },
  };
});

jest.mock("@expo/vector-icons", () => ({
  Feather: () => null,
  MaterialIcons: () => null,
  AntDesign: () => null,
}));

describe("Navigation Shell & Routing", () => {
  it("should instantiate EntryRedirect component", () => {
    const element = EntryRedirect();
    expect(element).toBeDefined();
  });

  it("should instantiate HomeScreen component", () => {
    const element = HomeScreen();
    expect(element).toBeDefined();
  });

  it("should instantiate CapturesScreen component", () => {
    const element = CapturesScreen();
    expect(element).toBeDefined();
  });

  it("should instantiate InsightsScreen component", () => {
    const element = InsightsScreen();
    expect(element).toBeDefined();
  });

  it("should instantiate DeviceScreen component", () => {
    const element = DeviceScreen();
    expect(element).toBeDefined();
  });

  it("should instantiate SettingsScreen component", () => {
    const element = SettingsScreen();
    expect(element).toBeDefined();
  });

  it("should instantiate CaptureDetailsModal component", () => {
    const element = CaptureDetailsModal();
    expect(element).toBeDefined();
  });

  it("should instantiate NotFoundScreen component", () => {
    const element = NotFoundScreen();
    expect(element).toBeDefined();
  });

  it("should pass navigation guard check", async () => {
    const guard = new AuthGuardPlaceholder();
    const result = await guard.canActivate("/home");
    expect(result.isSuccess).toBe(true);
    expect(result.getValueOrThrow()).toBe(true);
  });
});
