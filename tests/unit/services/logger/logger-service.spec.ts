import faker from "faker";
import { LoggerService } from "../../../../src/services/logger/logger-service";

const debugMock = jest.fn();
const infoMock = jest.fn();
const warnMock = jest.fn();
const errorMock = jest.fn();

jest.mock("@vizir/simple-json-logger", () => ({
  Logger: function () {
    return {
      debug: debugMock,
      info: infoMock,
      warn: warnMock,
      error: errorMock,
    };
  },
}));

describe("LoggerService", () => {
  describe("debug()", () => {
    it("Should call debug method of external lib with only message parameter", () => {
      const loggerService = new LoggerService();
      const message = faker.lorem.words();

      loggerService.debug(message);

      expect(debugMock).toHaveBeenNthCalledWith(1, message, undefined);
    });

    it("Should call debug method of external lib with message and extra parameters", () => {
      const loggerService = new LoggerService();
      const message = faker.lorem.words();
      const extra = {};

      loggerService.debug(message, extra);

      expect(debugMock).toHaveBeenNthCalledWith(1, message, extra);
    });
  });

  describe("info()", () => {
    it("Should call info method of external lib with only message parameter", () => {
      const loggerService = new LoggerService();
      const message = faker.lorem.words();

      loggerService.info(message);

      expect(infoMock).toHaveBeenNthCalledWith(1, message, undefined);
    });

    it("Should call info method of external lib with message and extra parameters", () => {
      const loggerService = new LoggerService();
      const message = faker.lorem.words();
      const extra = {};

      loggerService.info(message, extra);

      expect(infoMock).toHaveBeenNthCalledWith(1, message, extra);
    });
  });

  describe("warn()", () => {
    it("Should call warn method of external lib with only message parameter", () => {
      const loggerService = new LoggerService();
      const message = faker.lorem.words();

      loggerService.warn(message);

      expect(warnMock).toHaveBeenNthCalledWith(1, message, undefined);
    });

    it("Should call warn method of external lib with message and extra parameters", () => {
      const loggerService = new LoggerService();
      const message = faker.lorem.words();
      const extra = {};

      loggerService.warn(message, extra);

      expect(warnMock).toHaveBeenNthCalledWith(1, message, extra);
    });
  });

  describe("error()", () => {
    it("Should call error method of external lib with only message parameter", () => {
      const loggerService = new LoggerService();
      const message = faker.lorem.words();

      loggerService.error(message);

      expect(errorMock).toHaveBeenNthCalledWith(1, message, undefined);
    });

    it("Should call error method of external lib with message and extra parameters", () => {
      const loggerService = new LoggerService();
      const message = faker.lorem.words();
      const extra = {};

      loggerService.error(message, extra);

      expect(errorMock).toHaveBeenNthCalledWith(1, message, extra);
    });
  });
});
