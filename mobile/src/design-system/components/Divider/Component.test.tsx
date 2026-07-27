import React from "react";
import { render } from "@testing-library/react-native";
import { Divider } from "./Component";

describe("Divider Component", () => {
  it("renders correctly", async () => {
    const { container } = await render(<Divider />);
    expect(container).toBeDefined();
  });
});