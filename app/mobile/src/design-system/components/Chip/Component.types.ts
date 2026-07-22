import { GestureResponderEvent } from "react-native";

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
}