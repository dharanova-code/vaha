import React from "react";
import { render } from "@testing-library/react-native";
import HomeScreen from "../../app/(tabs)/home/index";

// Mock design system dependencies that require @expo/vector-icons
jest.mock("@expo/vector-icons", () => ({
  Feather: "Feather",
}));

jest.mock("../../src/features/devices/stores/deviceStore", () => ({
  useDeviceStore: jest.fn(() => ({
    connectionStatus: "connected",
    deviceStatus: { battery_percentage: 94 },
    connect: jest.fn(),
    refreshStatus: jest.fn(),
    refreshSensors: jest.fn(),
  })),
}));

jest.mock("../../src/features/devices/stores/captureStore", () => ({
  useCaptureStore: jest.fn(() => ({
    captures: [
      { id: 1, title: "Morning Coffee Contemplation", createdAt: new Date() },
      { id: 2, title: "Stitch Interface Notes", createdAt: new Date() },
    ],
    isLoading: false,
    loadLocalCaptures: jest.fn(),
  })),
}));

describe("HomeScreen Integration", () => {
  it("renders welcoming greeting header and reflection prompt", async () => {
    const { getByTestId, getByText } = await render(<HomeScreen />);
    expect(getByTestId("welcome-header")).toBeDefined();
    expect(getByText(/Good (Morning|Afternoon|Evening|Night)/)).toBeDefined();
  });

  it("renders device status metrics and companion pod", async () => {
    const { getByTestId, getByText } = await render(<HomeScreen />);
    expect(getByTestId("device-status")).toBeDefined();
    expect(getByText("CONNECTED")).toBeDefined();
    expect(getByText("94% BATTERY")).toBeDefined();
  });

  it("renders recent timeline captures list", async () => {
    const { getByTestId, getByText } = await render(<HomeScreen />);
    expect(getByTestId("recent-timeline")).toBeDefined();
    expect(getByText("Morning Coffee Contemplation")).toBeDefined();
    expect(getByText("Stitch Interface Notes")).toBeDefined();
  });
});

