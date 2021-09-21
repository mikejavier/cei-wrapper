import { Logger, LogLevelEnum } from "@vizir/simple-json-logger";
import faker from "faker";
import { ISettings, Settings } from "../../../../src/infrastructure/configurations/settings";
import { LoggerService } from "../../../../src/services/logger/logger-service";

const debugMock = jest.fn();
const infoMock = jest.fn();
const warnMock = jest.fn();
const errorMock = jest.fn();

jest.mock("@vizir/simple-json-logger", () => {
  const originalModule = jest.requireActual("@vizir/simple-json-logger");

  return {
    ...originalModule,
    Logger: jest.fn().mockImplementation(() => ({
      debug: debugMock,
      info: infoMock,
      warn: warnMock,
      error: errorMock,
    })),
  };
});

const generateServiceInstance = (settingsParameters: ISettings = {}) => {
  const settings = new Settings(settingsParameters);

  return new LoggerService(settings);
};

describe("LoggerService", () => {
  describe("Creating", () => {
    it("Should set level as info when debug is true", () => {
      generateServiceInstance({ debug: true });

      expect(Logger).toHaveBeenNthCalledWith(1, undefined, { logLevel: LogLevelEnum.INFO });
    });

    it("Should set level as warn when debug is false", () => {
      generateServiceInstance({ debug: false });

      expect(Logger).toHaveBeenNthCalledWith(1, undefined, { logLevel: LogLevelEnum.WARN });
    });
  });

  describe("debug()", () => {
    it("Should call debug method of external lib with only message parameter", () => {
      const loggerService = generateServiceInstance();
      const message = faker.lorem.words();

      loggerService.debug(message);

      expect(debugMock).toHaveBeenNthCalledWith(1, message, undefined);
    });

    it("Should call debug method of external lib with message and extra parameters", () => {
      const loggerService = generateServiceInstance();
      const message = faker.lorem.words();
      const extra = {};

      loggerService.debug(message, extra);

      expect(debugMock).toHaveBeenNthCalledWith(1, message, extra);
    });
  });

  describe("info()", () => {
    it("Should call info method of external lib with only message parameter", () => {
      const loggerService = generateServiceInstance();
      const message = faker.lorem.words();

      loggerService.info(message);

      expect(infoMock).toHaveBeenNthCalledWith(1, message, undefined);
    });

    it("Should call info method of external lib with message and extra parameters", () => {
      const loggerService = generateServiceInstance();
      const message = faker.lorem.words();
      const extra = {};

      loggerService.info(message, extra);

      expect(infoMock).toHaveBeenNthCalledWith(1, message, extra);
    });
  });

  describe("warn()", () => {
    it("Should call warn method of external lib with only message parameter", () => {
      const loggerService = generateServiceInstance();
      const message = faker.lorem.words();

      loggerService.warn(message);

      expect(warnMock).toHaveBeenNthCalledWith(1, message, undefined);
    });

    it("Should call warn method of external lib with message and extra parameters", () => {
      const loggerService = generateServiceInstance();
      const message = faker.lorem.words();
      const extra = {};

      loggerService.warn(message, extra);

      expect(warnMock).toHaveBeenNthCalledWith(1, message, extra);
    });
  });

  describe("error()", () => {
    it("Should call error method of external lib with only message parameter", () => {
      const loggerService = generateServiceInstance();
      const message = faker.lorem.words();

      loggerService.error(message);

      expect(errorMock).toHaveBeenNthCalledWith(1, message, undefined);
    });

    it("Should call error method of external lib with message and extra parameters", () => {
      const loggerService = generateServiceInstance();
      const message = faker.lorem.words();
      const extra = {};

      loggerService.error(message, extra);

      expect(errorMock).toHaveBeenNthCalledWith(1, message, extra);
    });
  });
});
