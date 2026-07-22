import React from "react";
import { render } from "@testing-library/react-native";
import { Icon } from "./Component";

// Mock @expo/vector-icons
jest.mock("@expo/vector-icons", () => ({
  Feather: "Feather",
}));

describe("Icon Component", () => {
  it("renders correctly with default settings", async () => {
    const { getByLabelText } = await render(<Icon name="home" />);
    expect(getByLabelText("home icon")).toBeDefined();
  });

  it("handles custom sizes and colors", async () => {
    const { getByLabelText } = await render(
      <Icon name="mic" size="large" color="#C07D53" accessibilityLabel="Custom mic" />
    );
    const element = getByLabelText("Custom mic");
    expect(element).toBeDefined();
  });
});
