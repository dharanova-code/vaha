import React from "react";
import { render } from "@testing-library/react-native";
import { DeviceCard } from "./Component";

describe("DeviceCard Component", () => {
  it("renders device properties correctly", async () => {
    const { getByText } = await render(<DeviceCard name="Vaha Pod v1" status="connected" />);
    expect(getByText("CONNECTED")).toBeDefined();
  });
});