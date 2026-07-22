import React from "react";
import { Text as RNText } from "react-native";
import { TextProps } from "./Component.types";
import { styles } from "./Component.styles";
import { theme } from "../../theme/tokens";

export const Text: React.FC<TextProps> = ({
  variant = "body-md",
  color = theme.colors.text.primary,
  align = "left",
  style,
  children,
  ...rest
}) => {
  const variantStyle = styles[variant];

  return (
    <RNText
      style={[
        variantStyle,
        { color, textAlign: align },
        style,
      ]}
      allowFontScaling={true}
      {...rest}
    >
      {children}
    </RNText>
  );
};
