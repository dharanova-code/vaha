import { Logger } from "../logger/Logger";
import { AppConfig } from "../config/AppConfig";
import { Container } from "../di/Container";

export interface RuntimeContext {
  readonly container: Container;
  readonly config: AppConfig;
  readonly logger: Logger;
}
