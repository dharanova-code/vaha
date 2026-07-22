import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";
import { TabBar } from "./Component";

describe("TabBar Component", () => {
  it("renders container successfully", async () => {
    const { getByText } = await render(<TabBar><Text>Home</Text></TabBar>);
    expect(getByText("Home")).toBeDefined();
  });
});