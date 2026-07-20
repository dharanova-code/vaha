import { AppState, AppStateStatus } from "react-native";
import { Logger } from "../logger/Logger";

export class AppLifecycle {
  private subscription: { remove: () => void } | undefined = undefined;

  constructor(private readonly logger: Logger) {}

  public startListening(): void {
    this.logger.info("Initializing AppLifecycle listeners.");
    this.subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      this.logger.info(`App lifecycle state changed to: ${nextAppState}`);
    });
  }

  public stopListening(): void {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = undefined;
      this.logger.info("AppLifecycle listeners removed.");
    }
  }
}
