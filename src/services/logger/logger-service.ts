import { Logger, LogLevelEnum } from "@vizir/simple-json-logger";
import { inject, injectable } from "inversify";
import { Settings } from "../../infrastructure/configurations/settings";

@injectable()
export class LoggerService {
  private readonly logger: Logger;
  private readonly settings: Settings;

  constructor(@inject(Settings) settings: Settings) {
    this.settings = settings;
    this.logger = new Logger(undefined, { logLevel: this.settings.debug ? LogLevelEnum.INFO : LogLevelEnum.WARN });
  }

  public debug(message: string, extra?: object): void {
    this.logger.debug(message, extra);
  }

  public info(message: string, extra?: object): void {
    this.logger.info(message, extra);
  }

  public warn(message: string, extra?: object): void {
    this.logger.warn(message, extra);
  }

  public error(message: string, extra?: object): void {
    this.logger.error(message, extra);
  }
}
