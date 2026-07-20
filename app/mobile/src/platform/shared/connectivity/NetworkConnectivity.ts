import * as Network from "expo-network";
import { Connectivity, ConnectivityState } from "./Connectivity";

export class ExpoNetworkConnectivity implements Connectivity {
  public async getState(): Promise<ConnectivityState> {
    const state = await Network.getNetworkStateAsync();
    return {
      isConnected: state.isConnected ?? false,
      isWifi: state.type === Network.NetworkStateType.WIFI,
    };
  }

  public onChange(
    callback: (state: ConnectivityState) => void,
  ): () => void {
    // Note: Expo Network does not expose a direct subscriber API on all SDK targets,
    // so we poll connectivity state as a simple fallback or return a blank unsubscriber.
    const interval = setInterval(async () => {
      const state = await this.getState();
      callback(state);
    }, 10000);

    return () => clearInterval(interval);
  }
}
