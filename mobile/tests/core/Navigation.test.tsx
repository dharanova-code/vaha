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

// Mock expo-sqlite to avoid initializing Native Modules in node test environment
jest.mock("expo-sqlite", () => ({
  openDatabaseSync: jest.fn(() => ({
    execSync: jest.fn(),
    closeSync: jest.fn(),
    getAllSync: jest.fn(() => []),
  })),
}));

// Mock react-native-svg to bypass Mixin resolution issues in Node test environment
jest.mock("react-native-svg", () => {
  const mockReact = require("react");
  const Svg = ({ children }: { children?: unknown }) => mockReact.createElement("svg", null, children);
  const Path = () => null;
  const Line = () => null;
  const Circle = () => null;
  const Defs = () => null;
  const LinearGradient = () => null;
  const Stop = () => null;
  return {
    __esModule: true,
    default: Svg,
    Path,
    Line,
    Circle,
    Defs,
    LinearGradient,
    Stop,
  };
});

// Mock expo-image-picker to avoid Native Module resolution issues in Node test environment
jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(),
  requestMediaLibraryPermissionsAsync: jest.fn(),
}));

// Mock expo-audio and expo-av
jest.mock("expo-audio", () => ({
  Audio: {
    Sound: jest.fn(),
  },
}));
jest.mock("expo-av", () => ({
  Audio: {
    Sound: jest.fn(),
  },
}));


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

jest.mock("react-native-safe-area-context", () => {
  const mockReact = require("react");
  const SafeAreaView = ({ children }: { children?: unknown }) =>
    mockReact.createElement("SafeAreaView", null, children);
  return {
    SafeAreaView,
    SafeAreaProvider: ({ children }: { children?: unknown }) =>
      mockReact.createElement("SafeAreaProvider", null, children),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 375, height: 812 }),
    initialWindowMetrics: { insets: { top: 0, bottom: 0, left: 0, right: 0 }, frame: { x: 0, y: 0, width: 375, height: 812 } },
  };
});

describe("Navigation Shell & Routing", () => {
  it("should export EntryRedirect as a function", () => {
    expect(typeof EntryRedirect).toBe("function");
  });

  it("should export HomeScreen as a function", () => {
    expect(typeof HomeScreen).toBe("function");
  });

  it("should export CapturesScreen as a function", () => {
    expect(typeof CapturesScreen).toBe("function");
  });

  it("should export InsightsScreen as a function", () => {
    expect(typeof InsightsScreen).toBe("function");
  });

  it("should export DeviceScreen as a function", () => {
    expect(typeof DeviceScreen).toBe("function");
  });

  it("should export SettingsScreen as a function", () => {
    expect(typeof SettingsScreen).toBe("function");
  });

  it("should export CaptureDetailsModal as a function", () => {
    expect(typeof CaptureDetailsModal).toBe("function");
  });

  it("should export NotFoundScreen as a function", () => {
    expect(typeof NotFoundScreen).toBe("function");
  });

  it("should pass navigation guard check", async () => {
    const guard = new AuthGuardPlaceholder();
    const result = await guard.canActivate("/home");
    expect(result.isSuccess).toBe(true);
    expect(result.getValueOrThrow()).toBe(true);
  });
});
