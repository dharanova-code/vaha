import React from "react";
import { render } from "@testing-library/react-native";
import { Loading } from "./Component";

describe("Loading Component", () => {
  it("renders circular progress successfully", async () => {
    const { container } = await render(<Loading variant="circular" />);
    expect(container).toBeDefined();
  });
});