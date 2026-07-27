import React from "react";
import { render } from "@testing-library/react-native";
import { CollectionCard } from "./Component";

describe("CollectionCard Component", () => {
  it("renders collection summary correctly", async () => {
    const { getByText } = await render(<CollectionCard name="Drafts" count={5} onPress={jest.fn()} />);
    expect(getByText("Drafts")).toBeDefined();
  });
});