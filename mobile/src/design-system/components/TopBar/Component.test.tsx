import React from "react";
import { render } from "@testing-library/react-native";
import { TopBar } from "./Component";

describe("TopBar Component", () => {
  it("renders title correctly", async () => {
    const { getByText } = await render(<TopBar title="Settings" />);
    expect(getByText("Settings")).toBeDefined();
  });
});