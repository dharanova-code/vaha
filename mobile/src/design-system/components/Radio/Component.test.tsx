import React from "react";
import { render } from "@testing-library/react-native";
import { Radio } from "./Component";

describe("Radio Component", () => {
  it("renders radio option successfully", async () => {
    const { getByRole } = await render(<Radio selected={false} onSelect={jest.fn()} />);
    expect(getByRole("radio")).toBeDefined();
  });
});