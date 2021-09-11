type allowedHttpMethods = "POST" | "GET" | "PATCH" | "PUT";

export interface HttpRequestOptions {
  body?: object | string;
  headers?: object;
  method: allowedHttpMethods;
  params?: object;
  url: string;
}
