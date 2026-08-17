export interface KeyValueStorage {
  getString(key: string): string | undefined;
  set(key: string, value: string): void;
  delete(key: string): void;
}

export class MMKVStorage implements KeyValueStorage {
  private storage: Record<string, string> = {};

  public getString(key: string): string | undefined {
    return this.storage[key];
  }

  public set(key: string, value: string): void {
    this.storage[key] = value;
  }

  public delete(key: string): void {
    delete this.storage[key];
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
        // Load the list of keys
        const keysRaw = await SecureStore.getItemAsync("vaha:storage_keys");
        if (keysRaw) {
          const keys: string[] = JSON.parse(keysRaw);
          for (const key of keys) {
            try {
              const val = await SecureStore.getItemAsync(key);
              if (val !== null && val !== undefined) {
                this.cache[key] = val;
              }
            } catch (err) {
              // ignore individual key read error
            }
          }
        } else {
          // Fallback check: if they had the old storage cache format, migrate it
          const oldRaw = await SecureStore.getItemAsync("vaha:storage_cache");
          if (oldRaw) {
            try {
              this.cache = JSON.parse(oldRaw);
              const keys = Object.keys(this.cache);
              await SecureStore.setItemAsync("vaha:storage_keys", JSON.stringify(keys));
              for (const key of keys) {
                await SecureStore.setItemAsync(key, this.cache[key] || "");
              }
              // Clear old cache
              await SecureStore.deleteItemAsync("vaha:storage_cache").catch(() => {});
            } catch (migrationErr) {
              // ignore migration errors
            }
          }
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
    this.persist(key, value);
  }

  public delete(key: string): void {
    delete ExpoStorage.cache[key];
    this.persistDelete(key);
  }

  private async persist(key: string, value: string) {
    try {
      const SecureStore = require("expo-secure-store");
      // Save value
      await SecureStore.setItemAsync(key, value);
      
      // Update key index
      const keys = Object.keys(ExpoStorage.cache);
      await SecureStore.setItemAsync("vaha:storage_keys", JSON.stringify(keys));
    } catch (e) {
      // ignore
    }
  }

  private async persistDelete(key: string) {
    try {
      const SecureStore = require("expo-secure-store");
      await SecureStore.deleteItemAsync(key);
      
      const keys = Object.keys(ExpoStorage.cache);
      await SecureStore.setItemAsync("vaha:storage_keys", JSON.stringify(keys));
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
