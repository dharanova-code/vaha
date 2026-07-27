import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";
import { Card } from "./Component";

describe("Card Component", () => {
  it("renders children inside card layout", async () => {
    const { getByText } = await render(<Card><Text>Inside Card</Text></Card>);
    expect(getByText("Inside Card")).toBeDefined();
  });
});