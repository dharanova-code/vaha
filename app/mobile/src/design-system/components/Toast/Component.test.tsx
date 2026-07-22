import React from "react";
import { render } from "@testing-library/react-native";
import { Toast } from "./Component";

describe("Toast Component", () => {
  it("renders when visible", async () => {
    const { getByText } = await render(<Toast visible={true} message="Dormant alert" />);
    expect(getByText("Dormant alert")).toBeDefined();
  });
});