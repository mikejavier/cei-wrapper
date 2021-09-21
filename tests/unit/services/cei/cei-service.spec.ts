import { plainToClass } from "class-transformer";
import faker from "faker";
import { ResultError } from "../../../../src/application/contracts/result/result-error";
import { ResultSuccess } from "../../../../src/application/contracts/result/result-success";
import { CeiService } from "../../../../src/services/cei/cei-service";
import { ConsolidatedValues } from "../../../../src/services/cei/entities/consolidated-value";
import { Investments } from "../../../../src/services/cei/entities/investments";
import { LatestProcessingDates } from "../../../../src/services/cei/entities/latest-processing-dates";
import { HttpService } from "../../../../src/services/http/http-service";
import { LoggerService } from "../../../../src/services/logger/logger-service";

const CONSOLIDATED_VALUES_URL = "https://investidor.b3.com.br/api/investidor/v1/posicao/total-acumulado";
const LATEST_PROCESSING_DATES_URL = "https://investidor.b3.com.br/api/sistema/v1/carga/ultima-execucao";

const generateInvestmentsUrl = (date: string, page: number) =>
  `https://investidor.b3.com.br/api/extrato/v1/posicao/${page}?data=${date}`;

const generateServiceInstance = (mockedRequest: jest.Mock) => {
  const loggerService = { error: jest.fn() } as unknown as LoggerService;
  const httpService = { request: mockedRequest } as unknown as HttpService;

  return new CeiService(httpService, loggerService);
};

const generateExpectedRequestParameters = (cacheId: string, token: string, url: string) => ({
  headers: { Authorization: `Bearer ${token}` },
  method: "GET",
  params: { "cache-guid": cacheId },
  url,
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

      const expectedRequestParameters = generateExpectedRequestParameters(
        authentication.cacheId,
        authentication.token,
        CONSOLIDATED_VALUES_URL,
      );
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

      const expectedRequestParameters = generateExpectedRequestParameters(
        authentication.cacheId,
        authentication.token,
        CONSOLIDATED_VALUES_URL,
      );
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

      const expectedRequestParameters = generateExpectedRequestParameters(
        authentication.cacheId,
        authentication.token,
        CONSOLIDATED_VALUES_URL,
      );
      const expectedResult = new ResultSuccess(plainToClass(ConsolidatedValues, mockedResponse.data.body));

      const result = await serviceInstance.getConsolidatedValues(authentication);

      expect(mockedRequest).toHaveBeenNthCalledWith(1, expectedRequestParameters);
      expect(result).toStrictEqual(expectedResult);
    });
  });

  describe("getInvestments()", () => {
    it("Should return error when fail to fetch investments", async () => {
      const date = faker.date.recent();
      const page = faker.datatype.number();
      const authentication = {
        cacheId: faker.datatype.uuid(),
        token: faker.datatype.uuid(),
      };
      const mockedRequest = jest.fn().mockResolvedValue(new ResultError(faker.lorem.words()));
      const serviceInstance = generateServiceInstance(mockedRequest);

      const expectedRequestParameters = generateExpectedRequestParameters(
        authentication.cacheId,
        authentication.token,
        generateInvestmentsUrl(date.toISOString().slice(0, 10), page),
      );
      const expectedResult = new ResultError("Fail to fetch investments");

      const result = await serviceInstance.getInvestments(date, page, authentication);

      expect(mockedRequest).toHaveBeenNthCalledWith(1, expectedRequestParameters);
      expect(result).toStrictEqual(expectedResult);
    });

    it("Should return error when received an invalid response", async () => {
      const date = faker.date.recent();
      const page = faker.datatype.number();
      const authentication = {
        cacheId: faker.datatype.uuid(),
        token: faker.datatype.uuid(),
      };
      const mockedRequest = jest.fn().mockResolvedValue(new ResultSuccess({ body: undefined }));
      const serviceInstance = generateServiceInstance(mockedRequest);

      const expectedRequestParameters = generateExpectedRequestParameters(
        authentication.cacheId,
        authentication.token,
        generateInvestmentsUrl(date.toISOString().slice(0, 10), page),
      );
      const expectedResult = new ResultError("Received an invalid data");

      const result = await serviceInstance.getInvestments(date, page, authentication);

      expect(mockedRequest).toHaveBeenNthCalledWith(1, expectedRequestParameters);
      expect(result).toStrictEqual(expectedResult);
    });

    it("Should return success when received investiments from service", async () => {
      const date = faker.date.recent();
      const page = faker.datatype.number();
      const authentication = {
        cacheId: faker.datatype.uuid(),
        token: faker.datatype.uuid(),
      };
      const mockedResponse = new ResultSuccess({
        body: {
          paginaAtual: faker.datatype.number(),
          totalPaginas: faker.datatype.number(),
          itens: [
            {
              categoriaProduto: "RendaVariavel",
              tipoProduto: "Acao",
              descricaoTipoProduto: "Ações",
              posicoes: [
                {
                  instituicao: faker.lorem.words(),
                  quantidade: faker.datatype.number(),
                  valorAtualizado: faker.datatype.number(),
                  precoFechamento: faker.datatype.number(),
                  produto: faker.lorem.words(),
                  tipo: faker.lorem.word(),
                  codigoNegociacao: faker.lorem.word(),
                  documentoInstituicao: faker.datatype.number().toString(),
                  disponivel: faker.datatype.number(),
                  razaoSocial: faker.lorem.words(),
                  escriturador: faker.lorem.words(),
                  valorBruto: faker.datatype.number(),
                },
              ],
              totalPosicao: faker.datatype.number(),
              totalItemsPagina: faker.datatype.number(),
            },
            {
              categoriaProduto: "TesouroDireto",
              tipoProduto: "TesouroDireto",
              descricaoTipoProduto: "Tesouro Direto",
              posicoes: [
                {
                  instituicao: faker.lorem.words(),
                  quantidade: faker.datatype.number(),
                  valorAtualizado: faker.datatype.number(),
                  vencimento: faker.date.future(),
                  valorAplicado: faker.datatype.number(),
                  produto: faker.lorem.words(),
                  documentoInstituicao: faker.datatype.number().toString(),
                  indexador: faker.lorem.word(),
                  disponivel: faker.datatype.number(),
                  valorBruto: faker.datatype.number(),
                  valorLiquido: faker.datatype.number(),
                  percRentabilidadeContratada: faker.datatype.number(),
                },
              ],
              totalPosicao: faker.datatype.number(),
              totalItemsPagina: faker.datatype.number(),
            },
          ],
          detalheStatusCode: faker.datatype.number(),
          excecoes: [],
        },
      });
      const mockedRequest = jest.fn().mockResolvedValue(mockedResponse);
      const serviceInstance = generateServiceInstance(mockedRequest);

      const expectedRequestParameters = generateExpectedRequestParameters(
        authentication.cacheId,
        authentication.token,
        generateInvestmentsUrl(date.toISOString().slice(0, 10), page),
      );
      const expectedResult = new ResultSuccess(
        plainToClass(Investments, mockedResponse.data.body, { excludeExtraneousValues: true }),
      );

      const result = await serviceInstance.getInvestments(date, page, authentication);

      expect(mockedRequest).toHaveBeenNthCalledWith(1, expectedRequestParameters);
      expect(result).toStrictEqual(expectedResult);
    });
  });

  describe("getLatestProcessingDates()", () => {
    it("Should return error when fail to fetch the latest processing dates", async () => {
      const authentication = {
        cacheId: faker.datatype.uuid(),
        token: faker.datatype.uuid(),
      };
      const mockedRequest = jest.fn().mockResolvedValue(new ResultError(faker.lorem.words()));
      const serviceInstance = generateServiceInstance(mockedRequest);

      const expectedRequestParameters = generateExpectedRequestParameters(
        authentication.cacheId,
        authentication.token,
        LATEST_PROCESSING_DATES_URL,
      );
      const expectedResult = new ResultError("Fail to fetch the latest processing dates from CEI");

      const result = await serviceInstance.getLatestProcessingDates(authentication);

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

      const expectedRequestParameters = generateExpectedRequestParameters(
        authentication.cacheId,
        authentication.token,
        LATEST_PROCESSING_DATES_URL,
      );
      const expectedResult = new ResultError("Received an invalid data");

      const result = await serviceInstance.getLatestProcessingDates(authentication);

      expect(mockedRequest).toHaveBeenNthCalledWith(1, expectedRequestParameters);
      expect(result).toStrictEqual(expectedResult);
    });

    it("Should return success when received the latest processing dates from service", async () => {
      const authentication = {
        cacheId: faker.datatype.uuid(),
        token: faker.datatype.uuid(),
      };
      const mockedResponse = new ResultSuccess({
        body: {
          dataDerivativos: faker.date.recent().toString(),
          dataGeral: faker.date.recent().toString(),
          dataRendaFixa: faker.date.recent().toString(),
          dataRendaVariavel: faker.date.recent().toString(),
          dataTesouroDireto: faker.date.recent().toString(),
        },
      });
      const mockedRequest = jest.fn().mockResolvedValue(mockedResponse);
      const serviceInstance = generateServiceInstance(mockedRequest);

      const expectedRequestParameters = generateExpectedRequestParameters(
        authentication.cacheId,
        authentication.token,
        LATEST_PROCESSING_DATES_URL,
      );
      const expectedResult = new ResultSuccess(plainToClass(LatestProcessingDates, mockedResponse.data.body));

      const result = await serviceInstance.getLatestProcessingDates(authentication);

      expect(mockedRequest).toHaveBeenNthCalledWith(1, expectedRequestParameters);
      expect(result).toStrictEqual(expectedResult);
    });
  });
});
