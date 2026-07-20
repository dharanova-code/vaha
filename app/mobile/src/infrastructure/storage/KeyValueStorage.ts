import { MMKV } from "react-native-mmkv";

export interface KeyValueStorage {
  getString(key: string): string | undefined;
  set(key: string, value: string): void;
  delete(key: string): void;
}

export class MMKVKeyValueStorage implements KeyValueStorage {
  private readonly mmkv = new MMKV();

  public getString(key: string): string | undefined {
    return this.mmkv.getString(key);
  }

  public set(key: string, value: string): void {
    this.mmkv.set(key, value);
  }

  public delete(key: string): void {
    this.mmkv.delete(key);
  }
}
