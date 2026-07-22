import React from "react";
import { render } from "@testing-library/react-native";
import { ListItem } from "./Component";

describe("ListItem Component", () => {
  it("renders title correctly", async () => {
    const { getByText } = await render(<ListItem title="Item Title" />);
    expect(getByText("Item Title")).toBeDefined();
  });
});