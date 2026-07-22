import { IconName } from "./Component.types";

export const IconRegistry = {
  home: "home" as IconName,
  record: "mic" as IconName,
  device: "cpu" as IconName,
  insights: "bar-chart-2" as IconName,
  settings: "settings" as IconName,
  success: "check-circle" as IconName,
  error: "alert-triangle" as IconName,
  warning: "alert-circle" as IconName,
  info: "info" as IconName,
  back: "chevron-left" as IconName,
  close: "x" as IconName,
  trash: "trash-2" as IconName,
  search: "search" as IconName,
  plus: "plus" as IconName,
  sync: "refresh-cw" as IconName,
  bluetooth: "bluetooth" as IconName,
  folder: "folder" as IconName,
} as const;

export type RegisteredIconName = keyof typeof IconRegistry;
export type IconRegistryType = typeof IconRegistry;
export default IconRegistry;
