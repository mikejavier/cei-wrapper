import { Container } from "inversify";
import { CeiService } from "../../services/cei/cei-service";
import { HttpService } from "../../services/http/http-service";
import { LoggerService } from "../../services/logger/logger-service";

const container = new Container();

container.bind(Container).toConstantValue(container);

container.bind(LoggerService).toSelf();
container.bind(HttpService).toSelf();
container.bind(CeiService).toSelf();

export { container };
