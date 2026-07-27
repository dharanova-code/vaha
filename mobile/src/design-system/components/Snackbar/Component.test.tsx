import React from "react";
import { render } from "@testing-library/react-native";
import { Snackbar } from "./Component";

describe("Snackbar Component", () => {
  it("renders when visible", async () => {
    const { getByText } = await render(<Snackbar visible={true} message="Saved successfully" onDismiss={jest.fn()} />);
    expect(getByText("Saved successfully")).toBeDefined();
  });
});