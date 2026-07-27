import * as SecureStore from "expo-secure-store";

export interface SecureStorage {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  deleteItem(key: string): Promise<void>;
}

export class ExpoSecureStorage implements SecureStorage {
  public async setItem(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  }

  public async getItem(key: string): Promise<string | null> {
    return await SecureStore.getItemAsync(key);
  }

  public async deleteItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  }
}
