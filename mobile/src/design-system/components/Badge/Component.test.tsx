import React from "react";
import { render } from "@testing-library/react-native";
import { Badge } from "./Component";

describe("Badge Component", () => {
  it("renders count badge correctly", async () => {
    const { getByText } = await render(<Badge count={3} />);
    expect(getByText("3")).toBeDefined();
  });
});