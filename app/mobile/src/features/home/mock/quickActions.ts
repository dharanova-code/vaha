export interface QuickAction {
  id: string;
  label: string;
  route: string;
  accessibilityLabel: string;
}

export const quickActions: QuickAction[] = [
  {
    id: "new-capture",
    label: "NEW CAPTURE",
    route: "/(tabs)/home", // placeholder route
    accessibilityLabel: "Start a new audio capture session",
  },
  {
    id: "open-journal",
    label: "REFLECTIONS",
    route: "/(tabs)/captures", // placeholder route
    accessibilityLabel: "Open your captures journal",
  },
  {
    id: "configure-ledger",
    label: "HARDWARE LEDGER",
    route: "/(tabs)/device", // placeholder route
    accessibilityLabel: "Open hardware companion settings",
  },
];
