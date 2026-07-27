import React from "react";
import { render } from "@testing-library/react-native";
import { SearchBar } from "./Component";

// Mock @expo/vector-icons
jest.mock("@expo/vector-icons", () => ({
  Feather: "Feather",
}));

describe("SearchBar Component", () => {
  it("renders correctly with placeholder text", async () => {
    const { getByPlaceholderText } = await render(<SearchBar />);
    expect(getByPlaceholderText("Find a thread of thought...")).toBeDefined();
  });
});