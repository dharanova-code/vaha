import { GestureResponderEvent } from "react-native";

export interface FABProps {
  onPress: (event: GestureResponderEvent) => void;
  accessibilityLabel?: string;
}