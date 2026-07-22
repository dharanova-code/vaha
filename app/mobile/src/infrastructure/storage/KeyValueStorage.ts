export interface KeyValueStorage {
  getString(key: string): string | undefined;
  set(key: string, value: string): void;
  delete(key: string): void;
}

export class MMKVStorage implements KeyValueStorage {
  private mmkv: any;

  constructor() {
    const { MMKV } = require("react-native-mmkv");
    this.mmkv = new MMKV();
  }

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

export class ExpoStorage implements KeyValueStorage {
  private static cache: Record<string, string> = {};
  private static isLoaded = false;
  private static loadingPromise: Promise<void> | null = null;

  public static async loadAll(): Promise<void> {
    if (this.isLoaded) return;
    if (this.loadingPromise) return this.loadingPromise;

    this.loadingPromise = (async () => {
      try {
        const SecureStore = require("expo-secure-store");
        const raw = await SecureStore.getItemAsync("vaha:storage_cache");
        if (raw) {
          this.cache = JSON.parse(raw);
        }
      } catch (e) {
        // ignore
      }
      this.isLoaded = true;
    })();
    return this.loadingPromise;
  }

  public getString(key: string): string | undefined {
    return ExpoStorage.cache[key];
  }

  public set(key: string, value: string): void {
    ExpoStorage.cache[key] = value;
    this.persist();
  }

  public delete(key: string): void {
    delete ExpoStorage.cache[key];
    this.persist();
  }

  private persist() {
    try {
      const SecureStore = require("expo-secure-store");
      SecureStore.setItemAsync("vaha:storage_cache", JSON.stringify(ExpoStorage.cache)).catch(() => {});
    } catch (e) {
      // ignore
    }
  }
}

export function getStorageService(): KeyValueStorage {
  let isExpoGo = false;
  try {
    const Constants = require("expo-constants").default || require("expo-constants");
    isExpoGo = Constants.appOwnership === "expo";
  } catch (e) {
    // ignore
  }
  if (isExpoGo) {
    return new ExpoStorage();
  }
  try {
    return new MMKVStorage();
  } catch (e) {
    return new ExpoStorage();
  }
}
