import React from "react";
import { render } from "@testing-library/react-native";
import { Text } from "./Component";

describe("Text Component", () => {
  it("renders correctly with children and default variant", async () => {
    const { getByText } = await render(<Text>Hello World</Text>);
    expect(getByText("Hello World")).toBeDefined();
  });

  it("handles alternative variants and custom colors", async () => {
    const { getByText } = await render(
      <Text variant="headline-lg" color="#C07D53">
        Custom Title
      </Text>
    );
    const element = getByText("Custom Title");
    expect(element.props.style).toContainEqual({ color: "#C07D53", textAlign: "left" });
  });
});
