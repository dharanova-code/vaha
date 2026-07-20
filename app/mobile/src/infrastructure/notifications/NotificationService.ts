import * as Notifications from "expo-notifications";

export interface NotificationService {
  scheduleLocalNotification(title: string, body: string): Promise<string>;
}

export class ExpoNotificationService implements NotificationService {
  public async scheduleLocalNotification(
    title: string,
    body: string,
  ): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: null, // deliver immediately
    });
  }
}
