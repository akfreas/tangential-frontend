export class TangentialHTTPRequestError extends Error {
  requestError: Error;
  url: string;
  params: Record<string, any>;
  headers?: Record<string, string>;

  constructor(
    message: string,
    requestError: Error,
    url: string,
    params: Record<string, any>,
    headers?: any
  ) {
    super(message);
    this.requestError = requestError;
    this.url = url;
    this.params = params;
    this.headers = headers;
  }
}
