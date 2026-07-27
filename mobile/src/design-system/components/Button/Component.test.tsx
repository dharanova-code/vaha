import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Button } from "./Component";

describe("Button Component", () => {
  it("renders text children correctly", async () => {
    const { getByText } = await render(<Button onPress={jest.fn()}>Test Button</Button>);
    expect(getByText("Test Button")).toBeDefined();
  });

  it("handles press events", async () => {
    const onPressMock = jest.fn();
    const { getByText } = await render(<Button onPress={onPressMock}>Press Me</Button>);
    fireEvent.press(getByText("Press Me"));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});