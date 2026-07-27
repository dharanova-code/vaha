import React from "react";
import { render } from "@testing-library/react-native";
import { Progress } from "./Component";

describe("Progress Component", () => {
  it("renders progressbar track", async () => {
    const { getByTestId } = await render(<Progress progress={0.5} />);
    expect(getByTestId("progress-track")).toBeDefined();
  });
});