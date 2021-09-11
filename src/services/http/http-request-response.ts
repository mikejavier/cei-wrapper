import { HttpRequestStatus } from "./http-request-status";

export class HttpRequestResponse<T> {
  public readonly body?: T;
  public readonly error?: object;
  public readonly errorMessage?: string;
  public readonly headers: object;
  public readonly request: object;
  public readonly response: object;
  public readonly status: HttpRequestStatus;
  public readonly statusCode: number;

  public constructor(data: HttpRequestResponse<T>) {
    this.body = data.body;
    this.error = data.error;
    this.errorMessage = data.errorMessage;
    this.headers = data.headers;
    this.request = data.request;
    this.response = data.response;
    this.status = data.status;
    this.statusCode = data.statusCode;
  }
}
