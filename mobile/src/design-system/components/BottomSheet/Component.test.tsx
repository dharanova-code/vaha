import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";
import { BottomSheet } from "./Component";

describe("BottomSheet Component", () => {
  it("renders contents when visible", async () => {
    const { getByText } = await render(
      <BottomSheet visible={true} onClose={jest.fn()}>
        <Text>Sheet Content</Text>
      </BottomSheet>
    );
    expect(getByText("Sheet Content")).toBeDefined();
  });
});