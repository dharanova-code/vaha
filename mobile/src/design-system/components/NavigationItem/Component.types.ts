import { RegisteredIconName } from "../Icon";

export interface NavigationItemProps {
  label: string;
  icon: RegisteredIconName;
  active: boolean;
  onPress: () => void;
}