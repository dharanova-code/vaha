import React from "react";
import { render } from "@testing-library/react-native";
import { CaptureCard } from "./Component";

describe("CaptureCard Component", () => {
  it("renders card content correctly", async () => {
    const { getByText } = await render(
      <CaptureCard title="Thought title" excerpt="Content excerpt" timestamp="12:00" onPress={jest.fn()} />
    );
    expect(getByText("Thought title")).toBeDefined();
  });
});