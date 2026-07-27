import React from "react";
import { render } from "@testing-library/react-native";
import { SensorCard } from "./Component";

describe("SensorCard Component", () => {
  it("renders sensor metrics correctly", async () => {
    const { getByText } = await render(<SensorCard label="Flow" value="1.2" unit="L/min" />);
    expect(getByText("FLOW")).toBeDefined();
  });
});