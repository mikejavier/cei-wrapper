import { plainToClass } from "class-transformer";
import faker from "faker";
import { ResultError } from "../../../../src/application/contracts/result/result-error";
import { ResultSuccess } from "../../../../src/application/contracts/result/result-success";
import { CeiService } from "../../../../src/services/cei/cei-service";
import { ConsolidatedValues } from "../../../../src/services/cei/entities/consolidated-value";
import { HttpService } from "../../../../src/services/http/http-service";
import { LoggerService } from "../../../../src/services/logger/logger-service";

const generateServiceInstance = (mockedRequest: jest.Mock) => {
  const loggerService = { error: jest.fn() } as unknown as LoggerService;
  const httpService = { request: mockedRequest } as unknown as HttpService;

  return new CeiService(httpService, loggerService);
};

const generateExpectedRequestParameters = (cacheId: string, token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
  method: "GET",
  params: { "cache-guid": cacheId },
  url: "https://investidor.b3.com.br/api/investidor/v1/posicao/total-acumulado",
});

describe("CeiService", () => {
  describe("getConsolidatedValues()", () => {
    it("Should return error when fail to fetch consolidated values", async () => {
      const authentication = {
        cacheId: faker.datatype.uuid(),
        token: faker.datatype.uuid(),
      };
      const mockedRequest = jest.fn().mockResolvedValue(new ResultError(faker.lorem.words()));
      const serviceInstance = generateServiceInstance(mockedRequest);

      const expectedRequestParameters = generateExpectedRequestParameters(authentication.cacheId, authentication.token);
      const expectedResult = new ResultError("Fail to fetch consolidated values");

      const result = await serviceInstance.getConsolidatedValues(authentication);

      expect(mockedRequest).toHaveBeenNthCalledWith(1, expectedRequestParameters);
      expect(result).toStrictEqual(expectedResult);
    });

    it("Should return error when received an invalid response", async () => {
      const authentication = {
        cacheId: faker.datatype.uuid(),
        token: faker.datatype.uuid(),
      };
      const mockedRequest = jest.fn().mockResolvedValue(new ResultSuccess({ body: undefined }));
      const serviceInstance = generateServiceInstance(mockedRequest);

      const expectedRequestParameters = generateExpectedRequestParameters(authentication.cacheId, authentication.token);
      const expectedResult = new ResultError("Received an invalid data");

      const result = await serviceInstance.getConsolidatedValues(authentication);

      expect(mockedRequest).toHaveBeenNthCalledWith(1, expectedRequestParameters);
      expect(result).toStrictEqual(expectedResult);
    });

    it("Should return success when received consolidated values from service", async () => {
      const authentication = {
        cacheId: faker.datatype.uuid(),
        token: faker.datatype.uuid(),
      };
      const mockedResponse = new ResultSuccess({
        body: {
          total: faker.datatype.number(),
          subTotais: [
            {
              categoriaProduto: faker.lorem.words(),
              totalPosicao: faker.datatype.number(),
              percentual: faker.datatype.number(),
            },
          ],
        },
      });
      const mockedRequest = jest.fn().mockResolvedValue(mockedResponse);
      const serviceInstance = generateServiceInstance(mockedRequest);

      const expectedRequestParameters = generateExpectedRequestParameters(authentication.cacheId, authentication.token);
      const expectedResult = new ResultSuccess(plainToClass(ConsolidatedValues, mockedResponse.data.body));

      const result = await serviceInstance.getConsolidatedValues(authentication);

      expect(mockedRequest).toHaveBeenNthCalledWith(1, expectedRequestParameters);
      expect(result).toStrictEqual(expectedResult);
    });
  });
});
