import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

export interface SurfaceProps {
  children: ReactNode;
  level?: "primary" | "secondary";
  style?: StyleProp<ViewStyle>;
}