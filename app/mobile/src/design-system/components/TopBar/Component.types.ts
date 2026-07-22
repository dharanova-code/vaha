import { ReactNode } from "react";

export interface TopBarProps {
  title: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
}