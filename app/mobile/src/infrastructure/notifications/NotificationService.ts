export interface NotificationService {
  scheduleLocalNotification(title: string, body: string): Promise<string>;
}

export class ExpoNotificationService implements NotificationService {
  public async scheduleLocalNotification(
    title: string,
    body: string,
  ): Promise<string> {
    const Notifications = require("expo-notifications");
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: null, // deliver immediately
    });
  }
}
