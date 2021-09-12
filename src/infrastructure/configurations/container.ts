import { Container } from "inversify";
import { AuthenticationService } from "../../services/authentication/authentication-service";
import { CeiService } from "../../services/cei/cei-service";
import { HttpService } from "../../services/http/http-service";
import { LoggerService } from "../../services/logger/logger-service";
import { ISettings, Settings } from "./settings";

export const createContainer = (settings: ISettings): Container => {
  const container = new Container();

  container.bind(Container).toConstantValue(container);

  container.bind(Settings).toConstantValue(new Settings(settings));
  container.bind(LoggerService).toSelf();
  container.bind(HttpService).toSelf();
  container.bind(CeiService).toSelf();
  container.bind(AuthenticationService).toSelf();

  return container;
};
