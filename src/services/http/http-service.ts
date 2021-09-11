import Axios, { AxiosRequestConfig } from "axios";
import { Result } from "../../application/contracts/result/result";
import { ResultError } from "../../application/contracts/result/result-error";
import { ResultSuccess } from "../../application/contracts/result/result-success";
import { LoggerService } from "../logger/logger-service";
import { HttpRequestOptions } from "./http-request-options";
import { HttpRequestResponse } from "./http-request-response";
import { HttpRequestStatus } from "./http-request-status";

export class HttpService {
  private readonly logger: LoggerService;

  public constructor(logger: LoggerService) {
    this.logger = logger;
  }

  public async request<T>(options: HttpRequestOptions): Promise<Result<HttpRequestResponse<T>>> {
    this.logger.info("Executing http request", { options });

    const request: AxiosRequestConfig = {
      data: options.body,
      headers: options.headers,
      method: options.method,
      params: options.params,
      timeout: 60000,
      url: options.url,
    };

    try {
      const response = await Axios(request);

      const result = {
        body: response.data,
        headers: response.headers,
        request,
        response: {
          body: response.data,
          headers: response.headers,
          status: response.status,
        },
        status: HttpRequestStatus.SUCCESS,
        statusCode: response.status,
      };

      this.logger.info("Http request successfully parsed result", {
        data: response.data,
        headers: response.headers,
        options,
        statusCode: response.status,
      });

      return new ResultSuccess(new HttpRequestResponse<T>(result));
    } catch (error) {
      this.logger.error("The http request result in a status code 4xx or 5xx", {
        options,
        error: error instanceof Error ? error.message : error,
      });

      return new ResultError("Failed to fetch request");
    }
  }
}
