export interface ConnectivityState {
  isConnected: boolean;
  isWifi: boolean;
}

export interface Connectivity {
  getState(): Promise<ConnectivityState>;
  onChange(callback: (state: ConnectivityState) => void): () => void;
}
