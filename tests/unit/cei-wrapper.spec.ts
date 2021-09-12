import { plainToClass } from "class-transformer";
import { ResultSuccess } from "../../src/application/contracts/result/result-success";
import { CeiWrapper } from "../../src/cei-wrapper";
import { CeiService } from "../../src/services/cei/cei-service";
import { ConsolidatedValues } from "../../src/services/cei/entities/consolidated-value";

const generateCeiWrapperInstance = (getConsolidatedValuesMock: jest.Mock) => {
  const ceiServiceMock = { getConsolidatedValues: getConsolidatedValuesMock } as unknown as CeiService;

  return new CeiWrapper(ceiServiceMock);
};

describe("CeiWrapper", () => {
  describe("getConsolidatedValues()", () => {
    it("Should return result success with the consolidated values", async () => {
      const resultMock = plainToClass(ConsolidatedValues, {});
      const getConsolidatedValuesMock = jest.fn().mockResolvedValue(new ResultSuccess(resultMock));
      const ceiWrapper = generateCeiWrapperInstance(getConsolidatedValuesMock);

      const expectedResult = new ResultSuccess(resultMock);

      const result = await ceiWrapper.getConsolidatedValues();

      expect(getConsolidatedValuesMock).toHaveBeenNthCalledWith(1, { cacheId: "", token: "" });
      expect(result).toStrictEqual(expectedResult);
    });
  });
});
