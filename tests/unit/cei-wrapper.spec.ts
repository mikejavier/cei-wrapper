import { plainToClass } from "class-transformer";
import faker from "faker";
import { ResultSuccess } from "../../src/application/contracts/result/result-success";
import { CeiWrapper } from "../../src/cei-wrapper";
import { ConsolidatedValues } from "../../src/services/cei/entities/consolidated-value";
import { Investments } from "../../src/services/cei/entities/investments";
import { LatestProcessingDates } from "../../src/services/cei/entities/latest-processing-dates";

let getConsolidatedValuesMock: jest.Mock;
let getInvestmentsMock: jest.Mock;
let getLatestProcessingDatesMock: jest.Mock;

jest.mock("../../src/infrastructure/configurations/container", () => ({
  createContainer: () => ({
    get: function () {
      return {
        getConsolidatedValues: getConsolidatedValuesMock,
        getInvestments: getInvestmentsMock,
        getLatestProcessingDates: getLatestProcessingDatesMock,
      };
    },
  }),
}));

describe("CeiWrapper", () => {
  describe("getConsolidatedValues()", () => {
    it("Should return result success with the consolidated values", async () => {
      const resultMock = plainToClass(ConsolidatedValues, {});

      getConsolidatedValuesMock = jest.fn().mockResolvedValue(new ResultSuccess(resultMock));

      const ceiWrapper = new CeiWrapper({ cacheId: "", token: "" });

      const expectedResult = new ResultSuccess(resultMock);

      const result = await ceiWrapper.getConsolidatedValues();

      expect(getConsolidatedValuesMock).toHaveBeenNthCalledWith(1, { cacheId: "", token: "" });
      expect(result).toStrictEqual(expectedResult);
    });
  });

  describe("getInvestments()", () => {
    it("Should return result success with the investments", async () => {
      const defaultDate = faker.date.recent().toString();
      const defaultPage = 1;
      const resultMock = plainToClass(Investments, {});

      getInvestmentsMock = jest.fn().mockResolvedValue(new ResultSuccess(resultMock));
      getLatestProcessingDatesMock = jest
        .fn()
        .mockResolvedValue(new ResultSuccess(plainToClass(LatestProcessingDates, { dataGeral: defaultDate })));

      const ceiWrapper = new CeiWrapper({ cacheId: "", token: "" });

      const expectedResult = new ResultSuccess(resultMock);

      const result = await ceiWrapper.getInvestments();

      expect(getInvestmentsMock).toHaveBeenNthCalledWith(1, new Date(defaultDate), defaultPage, {
        cacheId: "",
        token: "",
      });
      expect(result).toStrictEqual(expectedResult);
    });
  });
});
