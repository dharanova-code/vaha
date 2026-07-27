export interface SnackbarProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
}