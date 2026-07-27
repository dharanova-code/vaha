import React from "react";
import { render } from "@testing-library/react-native";
import { SectionHeader } from "./Component";

describe("SectionHeader Component", () => {
  it("renders header title correctly", async () => {
    const { getByText } = await render(<SectionHeader title="Section Title" />);
    expect(getByText("Section Title")).toBeDefined();
  });
});