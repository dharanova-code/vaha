export interface CaptureCardProps {
  title: string;
  excerpt: string;
  timestamp: string;
  duration?: string;
  onPress: () => void;
  onLongPress?: () => void;
  selected?: boolean;
  selectionModeActive?: boolean;
}