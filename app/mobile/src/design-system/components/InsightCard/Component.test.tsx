import React from "react";
import { render } from "@testing-library/react-native";
import { InsightCard } from "./Component";

describe("InsightCard Component", () => {
  it("renders reflection quote correctly", async () => {
    const { getByText } = await render(<InsightCard quote="Reflection" sourceTitle="Core" timestamp="11:30" />);
    expect(getByText("“Reflection”")).toBeDefined();
  });
});