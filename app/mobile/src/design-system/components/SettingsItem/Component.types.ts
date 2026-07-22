import { ReactNode } from "react";

export interface SettingsItemProps {
  label: string;
  value?: string;
  rightElement?: ReactNode;
  onPress?: () => void;
}