import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Switch } from "./Component";

describe("Switch Component", () => {
  it("fires change trigger on press", async () => {
    const onValueChangeMock = jest.fn();
    const { getByRole } = await render(<Switch value={false} onValueChange={onValueChangeMock} />);
    fireEvent.press(getByRole("switch"));
    expect(onValueChangeMock).toHaveBeenCalledWith(true);
  });
});