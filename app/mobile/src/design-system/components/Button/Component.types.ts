import { ReactNode } from "react";
import { GestureResponderEvent, StyleProp, ViewStyle } from "react-native";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";

export interface ButtonProps {
  children: string | ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}