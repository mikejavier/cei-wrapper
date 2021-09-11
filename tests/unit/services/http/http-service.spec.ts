import axios from "axios";
import faker from "faker";
import { ResultError } from "../../../../src/application/contracts/result/result-error";
import { ResultSuccess } from "../../../../src/application/contracts/result/result-success";
import { HttpRequestOptions } from "../../../../src/services/http/http-request-options";
import { HttpRequestResponse } from "../../../../src/services/http/http-request-response";
import { HttpRequestStatus } from "../../../../src/services/http/http-request-status";
import { HttpService } from "../../../../src/services/http/http-service";
import { LoggerService } from "../../../../src/services/logger/logger-service";

jest.mock("axios");

const generateServiceInstance = () => {
  const logger = { info: jest.fn(), error: jest.fn() } as unknown as LoggerService;

  return new HttpService(logger);
};

describe("HttpService", () => {
  describe("request()", () => {
    it("Should return ResultSuccess with HttpRequestResponse entity when http request succeeds", async () => {
      const httpService = generateServiceInstance();

      const options: HttpRequestOptions = {
        method: "GET",
        url: faker.internet.url(),
      };

      const axiosResponse = {
        data: {},
        status: 200,
        statusText: "ok",
        headers: {},
      };

      const expectedResult = new ResultSuccess(
        new HttpRequestResponse({
          body: {},
          error: undefined,
          errorMessage: undefined,
          headers: {},
          request: {
            data: undefined,
            headers: undefined,
            method: options.method,
            params: undefined,
            timeout: 60000,
            url: options.url,
          },
          response: {
            body: {},
            headers: {},
            status: 200,
          },
          status: HttpRequestStatus.SUCCESS,
          statusCode: 200,
        }),
      );

      (axios as unknown as jest.Mock).mockResolvedValue(axiosResponse);

      const result = await httpService.request(options);

      expect(result).toStrictEqual(expectedResult);
    });

    it("Should return ResultError when http request fails", async () => {
      const httpService = generateServiceInstance();

      const options: HttpRequestOptions = {
        method: "GET",
        url: faker.internet.url(),
      };

      const expectedResult = new ResultError("Failed to fetch request");

      (axios as unknown as jest.Mock).mockRejectedValue(undefined);

      const result = await httpService.request(options);

      expect(result).toStrictEqual(expectedResult);
    });
  });
});
