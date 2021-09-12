import { plainToClass } from "class-transformer";
import { validateSync } from "class-validator";
import { Result } from "../../application/contracts/result/result";
import { ResultError } from "../../application/contracts/result/result-error";
import { ResultSuccess } from "../../application/contracts/result/result-success";
import { HttpRequestResponse } from "../http/http-request-response";
import { HttpService } from "../http/http-service";
import { LoggerService } from "../logger/logger-service";
import { ConsolidatedValues } from "./entities/consolidated-value";

interface IAuthentication {
  cacheId: string;
  token: string;
}

export class CeiService {
  private readonly logger: LoggerService;
  private readonly http: HttpService;

  public constructor(http: HttpService, logger: LoggerService) {
    this.logger = logger;
    this.http = http;
  }

  public async getConsolidatedValues(authentication: IAuthentication): Promise<Result<ConsolidatedValues>> {
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
      authentication,
    );

    if (response.isError) {
      this.logger.error("Fail to fetch consolidated values", { response });

      return new ResultError("Fail to fetch consolidated values");
    }

    const consolidatedValues = plainToClass(ConsolidatedValues, response.data.body ?? {});

    const errors = validateSync(consolidatedValues);

    if (errors.length > 0) {
      this.logger.error("Received an invalid data", { response });

      return new ResultError("Received an invalid data");
    }

    return new ResultSuccess(consolidatedValues);
  }

  private makeRequest<T>(endpoint: string, authentication: IAuthentication): Promise<Result<HttpRequestResponse<T>>> {
    return this.http.request<T>({
      url: `${process.env.CEI_API_URL}/${endpoint}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${authentication.token}`,
      },
      params: {
        "cache-guid": authentication.cacheId,
      },
    });
  }
}
