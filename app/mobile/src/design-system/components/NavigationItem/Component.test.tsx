import React from "react";
import { render } from "@testing-library/react-native";
import { NavigationItem } from "./Component";

// Mock @expo/vector-icons
jest.mock("@expo/vector-icons", () => ({
  Feather: "Feather",
}));

describe("NavigationItem Component", () => {
  it("renders correctly with active state", async () => {
    const { getByText } = await render(
      <NavigationItem label="Home" icon="home" active={true} onPress={jest.fn()} />
    );
    expect(getByText("HOME")).toBeDefined();
  });
});