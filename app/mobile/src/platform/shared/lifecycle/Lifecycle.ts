export type AppStateStatus = "active" | "background" | "inactive";

export interface Lifecycle {
  getStatus(): AppStateStatus;
  onChange(callback: (status: AppStateStatus) => void): () => void;
}
