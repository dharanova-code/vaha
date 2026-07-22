import React from "react";
import { render } from "@testing-library/react-native";
import { EmptyState } from "./Component";

// Mock @expo/vector-icons
jest.mock("@expo/vector-icons", () => ({
  Feather: "Feather",
}));

describe("EmptyState Component", () => {
  it("renders corresponding variant title", async () => {
    const { getByText } = await render(<EmptyState variant="captures" />);
    expect(getByText("No Captures Yet")).toBeDefined();
  });
});