import faker from "faker";
import { ResultError } from "../../../../src/application/contracts/result/result-error";
import { ResultSuccess } from "../../../../src/application/contracts/result/result-success";
import { AntiCaptchaService } from "../../../../src/services/anti-captcha/anti-captcha-service";
import { LoggerService } from "../../../../src/services/logger/logger-service";

let getTaskResultMock = jest.fn();

jest.mock("anticaptcha", () => ({
  TaskTypes: jest.fn(),
  AntiCaptcha: function () {
    return {
      isBalanceGreaterThan: jest.fn(),
      createTask: jest.fn(),
      getTaskResult: getTaskResultMock,
    };
  },
}));

const generateServiceInstance = () => {
  const loggerServiceMock = { info: jest.fn(), error: jest.fn(), warn: jest.fn() } as unknown as LoggerService;

  return new AntiCaptchaService(loggerServiceMock);
};

describe("AntiCaptchaService", () => {
  describe("resolve()", () => {
    it("Should return result success with token after resolve captcha successfully", async () => {
      const token = faker.datatype.uuid();
      const parameters = {
        serviceKey: faker.datatype.uuid(),
        websiteKey: faker.datatype.uuid(),
        websiteURL: faker.internet.url(),
      };
      const service = generateServiceInstance();

      const expectedResult = new ResultSuccess(token);

      getTaskResultMock = jest.fn().mockResolvedValue({ solution: { gRecaptchaResponse: token } });

      const result = await service.resolve(parameters);

      expect(result).toStrictEqual(expectedResult);
    });

    it("Should return result error when fail to resolve captcha", async () => {
      const parameters = {
        serviceKey: faker.datatype.uuid(),
        websiteKey: faker.datatype.uuid(),
        websiteURL: faker.internet.url(),
      };
      const service = generateServiceInstance();

      const expectedResult = new ResultError("Fail to resolve captcha");

      getTaskResultMock = jest.fn().mockRejectedValue("");

      const result = await service.resolve(parameters);

      expect(result).toStrictEqual(expectedResult);
    });
  });
});
