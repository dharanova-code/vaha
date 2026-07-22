import React from "react";
import { render } from "@testing-library/react-native";
import { Chip } from "./Component";

describe("Chip Component", () => {
  it("renders chip label correctly", async () => {
    const { getByText } = await render(<Chip label="Tag Label" />);
    expect(getByText("Tag Label")).toBeDefined();
  });
});