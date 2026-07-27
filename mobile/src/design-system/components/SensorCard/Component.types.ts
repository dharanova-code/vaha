export interface SensorCardProps {
  label: string;
  value: string;
  unit?: string;
  status?: "normal" | "warning" | "alert";
}