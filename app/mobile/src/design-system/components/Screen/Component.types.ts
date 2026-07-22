import { ReactNode, ReactElement } from "react";
import { StyleProp, ViewStyle, RefreshControlProps } from "react-native";

export interface ScreenProps {
  children: ReactNode;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  withMarginThread?: boolean;
  /** Optional RefreshControl element to enable pull-to-refresh on scrollable screens */
  refreshControl?: ReactElement<RefreshControlProps>;
}