import React from "react";
import { render } from "@testing-library/react-native";
import { FAB } from "./Component";

describe("FAB Component", () => {
  it("renders trigger successfully", async () => {
    const { getByText } = await render(<FAB onPress={jest.fn()} />);
    expect(getByText("UTILITY ACTION")).toBeDefined();
  });
});