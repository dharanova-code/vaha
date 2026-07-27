import React from "react";
import { render } from "@testing-library/react-native";
import { Tag } from "./Component";

describe("Tag Component", () => {
  it("renders tag correctly", async () => {
    const { getByText } = await render(<Tag label="Active" />);
    expect(getByText("ACTIVE")).toBeDefined();
  });
});