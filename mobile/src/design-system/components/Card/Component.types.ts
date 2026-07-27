import { ReactNode } from "react";
import { GestureResponderEvent, StyleProp, ViewStyle } from "react-native";

export interface CardProps {
  children: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  variant?: "default" | "outlined" | "interactive";
}