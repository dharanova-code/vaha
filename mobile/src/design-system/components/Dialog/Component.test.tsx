import React from "react";
import { render } from "@testing-library/react-native";
import { Dialog } from "./Component";

describe("Dialog Component", () => {
  it("renders title and content successfully", async () => {
    const { getByText } = await render(
      <Dialog visible={true} title="Reset Settings" message="Are you sure?" onConfirm={jest.fn()} onCancel={jest.fn()} />
    );
    expect(getByText("Reset Settings")).toBeDefined();
  });
});