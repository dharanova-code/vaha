import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";
import { Surface } from "./Component";

describe("Surface Component", () => {
  it("renders content inside surface", async () => {
    const { getByText } = await render(<Surface><Text>Surface text</Text></Surface>);
    expect(getByText("Surface text")).toBeDefined();
  });
});
