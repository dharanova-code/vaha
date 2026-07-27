import { TextProps as RNTextProps } from "react-native";

export type TextVariant =
  | "display-lg"
  | "headline-lg"
  | "body-md"
  | "label-sm"
  | "meta-sm"
  | "mono-bold"
  | "mono-reg";

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  align?: "left" | "center" | "right" | "justify";
}
