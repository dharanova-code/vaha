import { Audio } from "expo-av";
import { Linking } from "react-native";

export type PermissionResult = {
  microphone: "granted" | "denied" | "unavailable";
  notifications: "granted" | "denied" | "unavailable";
};

/**
 * Detect whether we are running inside Expo Go (not a development build).
 * expo-notifications push tokens are not available in Expo Go since SDK 53.
 */
function isExpoGo(): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Constants = require("expo-constants").default ?? require("expo-constants");
    return (
      Constants.executionEnvironment === "storeClient" ||
      Constants.executionEnvironment === "store-client" ||
      Constants.appOwnership === "expo"
    );
  } catch {
    return false;
  }
}

/**
 * PermissionService — requests all runtime permissions the app needs.
 * Safe to call multiple times; won't re-prompt if already granted.
 */
export class PermissionService {
  /**
   * Request microphone permission.
   */
  static async requestMicrophone(): Promise<"granted" | "denied"> {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === "granted" ? "granted" : "denied";
    } catch {
      return "denied";
    }
  }

  /**
   * Check microphone permission without prompting.
   */
  static async checkMicrophone(): Promise<boolean> {
    try {
      const { status } = await Audio.getPermissionsAsync();
      return status === "granted";
    } catch {
      return false;
    }
  }

  /**
   * Request push notification permission.
   * Skipped entirely in Expo Go (SDK 53+) to avoid the crash/warning.
   * On Android 13+ (API 33+) this dialog is required.
   */
  static async requestNotifications(): Promise<"granted" | "denied" | "unavailable"> {
    // Expo Go does not support push tokens — skip silently
    if (isExpoGo()) {
      return "unavailable";
    }

    try {
      // Dynamically import to avoid loading push token code in Expo Go
      const { requestPermissionsAsync } = await import("expo-notifications");
      const { status } = await requestPermissionsAsync();
      return status === "granted" ? "granted" : "denied";
    } catch {
      return "unavailable";
    }
  }

  /**
   * Request all permissions the app needs at startup.
   */
  static async requestAll(): Promise<PermissionResult> {
    const mic = await PermissionService.requestMicrophone();
    const notif = await PermissionService.requestNotifications();
    return { microphone: mic, notifications: notif };
  }

  /**
   * Open system app settings for the user to manually grant permissions.
   */
  static openSettings(): void {
    Linking.openSettings().catch(() => {});
  }
}
