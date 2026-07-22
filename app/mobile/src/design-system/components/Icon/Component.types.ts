import { Feather } from "@expo/vector-icons";

export type IconName = keyof typeof Feather.glyphMap;

export interface IconProps {
  name: IconName;
  color?: string;
  size?: "small" | "standard" | "large" | number;
  accessibilityLabel?: string;
}
