import React from "react";
import { render } from "@testing-library/react-native";
import { Avatar } from "./Component";

describe("Avatar Component", () => {
  it("renders avatar initials correctly", async () => {
    const { getByText } = await render(<Avatar initials="VH" />);
    expect(getByText("VH")).toBeDefined();
  });
});