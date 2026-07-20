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

// Mock dependencies
jest.mock("expo-router", () => {
  return {
    Redirect: () => null,
    Link: () => null,
    Slot: () => null,
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
