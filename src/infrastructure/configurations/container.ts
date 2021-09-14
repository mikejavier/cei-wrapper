import { Container } from "inversify";
import { AntiCaptchaService } from "../../services/anti-captcha/anti-captcha-service";
import { AuthenticationService } from "../../services/authentication/authentication-service";
import { CeiService } from "../../services/cei/cei-service";
import { HttpService } from "../../services/http/http-service";
import { LoggerService } from "../../services/logger/logger-service";

export const createContainer = (): Container => {
  const container = new Container();

  container.bind(Container).toConstantValue(container);

  container.bind(LoggerService).toSelf();
  container.bind(HttpService).toSelf();
  container.bind(CeiService).toSelf();
  container.bind(AuthenticationService).toSelf();
  container.bind(AntiCaptchaService).toSelf();

  return container;
};
