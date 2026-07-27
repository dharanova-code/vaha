import React from "react";
import { render } from "@testing-library/react-native";
import { Input } from "./Component";

describe("Input Component", () => {
  it("renders text input with placeholder", async () => {
    const { getByPlaceholderText } = await render(<Input placeholder="Type here" />);
    expect(getByPlaceholderText("Type here")).toBeDefined();
  });
});