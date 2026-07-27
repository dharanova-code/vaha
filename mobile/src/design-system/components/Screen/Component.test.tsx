import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";
import { Screen } from "./Component";

describe("Screen Component", () => {
  it("renders screen layout successfully", async () => {
    const { getByText } = await render(<Screen><Text>Screen Content</Text></Screen>);
    expect(getByText("Screen Content")).toBeDefined();
  });
});