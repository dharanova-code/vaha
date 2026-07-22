import React from "react";
import { render } from "@testing-library/react-native";
import { SettingsItem } from "./Component";

// Mock @expo/vector-icons
jest.mock("@expo/vector-icons", () => ({
  Feather: "Feather",
}));

describe("SettingsItem Component", () => {
  it("renders correctly with label", async () => {
    const { getByText } = await render(<SettingsItem label="Encryption Key" value="AES-256" />);
    expect(getByText("Encryption Key")).toBeDefined();
  });
});