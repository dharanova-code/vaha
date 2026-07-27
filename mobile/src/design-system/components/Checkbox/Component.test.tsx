import React from "react";
import { render } from "@testing-library/react-native";
import { Checkbox } from "./Component";

// Mock @expo/vector-icons
jest.mock("@expo/vector-icons", () => ({
  Feather: "Feather",
}));

describe("Checkbox Component", () => {
  it("renders component layout successfully", async () => {
    const { getByRole } = await render(<Checkbox checked={false} onChange={jest.fn()} />);
    expect(getByRole("checkbox")).toBeDefined();
  });
});