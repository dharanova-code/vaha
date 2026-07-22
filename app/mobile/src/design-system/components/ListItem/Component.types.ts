import { ReactNode } from "react";
import { GestureResponderEvent } from "react-native";

export interface ListItemProps {
  title: string;
  subtitle?: string;
  rightElement?: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
}