import { plainToClass } from "class-transformer";
import { validateSync } from "class-validator";
import { inject, injectable } from "inversify";
import { Result } from "../../application/contracts/result/result";
import { ResultError } from "../../application/contracts/result/result-error";
import { ResultSuccess } from "../../application/contracts/result/result-success";
import { AuthenticationContext } from "../authentication/entities/authentication-context";
import { HttpRequestResponse } from "../http/http-request-response";
import { HttpService } from "../http/http-service";
import { LoggerService } from "../logger/logger-service";
import { ConsolidatedValues } from "./entities/consolidated-value";
import { Investments } from "./entities/investments";

@injectable()
export class CeiService {
  private readonly loggerService: LoggerService;
  private readonly httpService: HttpService;

  public constructor(
    @inject(HttpService) httpService: HttpService,
    @inject(LoggerService) loggerService: LoggerService,
  ) {
    this.loggerService = loggerService;
    this.httpService = httpService;
  }

  public async getConsolidatedValues(
    authenticationContext: AuthenticationContext,
  ): Promise<Result<ConsolidatedValues>> {
    interface IConsolidatedValuesResponse {
      total: number;
      subTotais: {
        categoriaProduto: string;
        totalPosicao: number;
        percentual: number;
      }[];
    }

    const response = await this.makeRequest<IConsolidatedValuesResponse>(
      "/investidor/v1/posicao/total-acumulado",
      authenticationContext,
    );

    if (response.isError) {
      this.loggerService.error("Fail to fetch consolidated values", { response });

      return new ResultError("Fail to fetch consolidated values");
    }

    const consolidatedValues = plainToClass(ConsolidatedValues, response.data.body ?? {});

    const errors = validateSync(consolidatedValues);

    if (errors.length > 0) {
      this.loggerService.error("Received an invalid data", { response });

      return new ResultError("Received an invalid data");
    }

    return new ResultSuccess(consolidatedValues);
  }

  public async getInvestments(
    date: Date,
    page: number,
    authenticationContext: AuthenticationContext,
  ): Promise<Result<Investments>> {
    const response = await this.makeRequest(
      `/extrato/v1/posicao/${page}?data=${date.toISOString().slice(0, 10)}`,
      authenticationContext,
    );

    if (response.isError) {
      this.loggerService.error("Fail to fetch investments", { response });

      return new ResultError("Fail to fetch investments");
    }

    const investments = plainToClass(Investments, response.data.body ?? {}, { excludeExtraneousValues: true });

    const errors = validateSync(investments);

    if (errors.length > 0) {
      this.loggerService.error("Received an invalid data", { response, errors });

      return new ResultError("Received an invalid data");
    }

    return new ResultSuccess(investments);
  }

  private makeRequest<T>(
    endpoint: string,
    authenticationContext: AuthenticationContext,
  ): Promise<Result<HttpRequestResponse<T>>> {
    return this.httpService.request<T>({
      url: "https://investidor.b3.com.br/api" + endpoint,
      method: "GET",
      headers: {
        Authorization: `Bearer ${authenticationContext.token}`,
      },
      params: {
        "cache-guid": authenticationContext.cacheId,
      },
    });
  }
}
