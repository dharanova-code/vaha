import React from "react";
import { render } from "@testing-library/react-native";
import { Toggle } from "./Component";

describe("Toggle Component", () => {
  it("renders correctly with label", async () => {
    const { getByText } = await render(<Toggle label="Enable Notifications" value={false} onValueChange={jest.fn()} />);
    expect(getByText("Enable Notifications")).toBeDefined();
  });
});