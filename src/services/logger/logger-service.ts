import { Logger } from "@vizir/simple-json-logger";
import { injectable } from "inversify";

@injectable()
export class LoggerService {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger();
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
