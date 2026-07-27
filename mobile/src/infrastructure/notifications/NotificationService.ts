import Constants from "expo-constants";

export interface NotificationService {
  scheduleLocalNotification(title: string, body: string): Promise<string>;
}

export class ExpoGoNotificationService implements NotificationService {
  public async scheduleLocalNotification(
    title: string,
    body: string,
  ): Promise<string> {
    return Promise.resolve("");
  }
}

export class NativeNotificationService implements NotificationService {
  public async scheduleLocalNotification(
    title: string,
    body: string,
  ): Promise<string> {
    try {
      const Notifications = require("expo-notifications");
      return await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
        },
        trigger: null, // deliver immediately
      });
    } catch (e) {
      return "";
    }
  }
}

export function createNotificationService(): NotificationService {
  let isExpoGo = false;
  try {
    const Constants = require("expo-constants").default || require("expo-constants");
    isExpoGo = Constants.executionEnvironment === "store-client" || Constants.appOwnership === "expo";
  } catch (e) {
    // ignore
  }

  if (isExpoGo) {
    return new ExpoGoNotificationService();
  }
  return new NativeNotificationService();
}
