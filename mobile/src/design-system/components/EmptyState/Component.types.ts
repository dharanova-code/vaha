export type EmptyStateVariant = "captures" | "devices" | "insights" | "collections" | "search";

export interface EmptyStateProps {
  variant: EmptyStateVariant;
  title?: string;
  message?: string;
}
