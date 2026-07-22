import { ReactNode } from "react";

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}