import { plainToClass } from "class-transformer";
import { ResultSuccess } from "../../src/application/contracts/result/result-success";
import { CeiWrapper } from "../../src/cei-wrapper";
import { ConsolidatedValues } from "../../src/services/cei/entities/consolidated-value";

let getConsolidatedValuesMock: jest.Mock;

jest.mock("../../src/infrastructure/configurations/container", () => ({
  container: {
    get: function () {
      return {
        getConsolidatedValues: getConsolidatedValuesMock,
      };
    },
  },
}));

describe("CeiWrapper", () => {
  describe("getConsolidatedValues()", () => {
    it("Should return result success with the consolidated values", async () => {
      const resultMock = plainToClass(ConsolidatedValues, {});

      getConsolidatedValuesMock = jest.fn().mockResolvedValue(new ResultSuccess(resultMock));

      const ceiWrapper = new CeiWrapper();

      const expectedResult = new ResultSuccess(resultMock);

      const result = await ceiWrapper.getConsolidatedValues();

      expect(getConsolidatedValuesMock).toHaveBeenNthCalledWith(1, { cacheId: "", token: "" });
      expect(result).toStrictEqual(expectedResult);
    });
  });
});
