import AuthorizationType from './constants/AuthorizationType';
import HttpClientResponse from './HttpClientResponse';
import HttpClientRetryStrategy from './HttpClientRetryStrategy';
import HttpClientConfiguration from './HttpClientConfiguration';
import HttpMethod from './constants/HttpMethod';

export default class HttpClient {
  private baseUrl: string;
  private paths!: string[];
  private params: any;
  private method!: HttpMethod;
  private body: any;
  private headers: any;
  private configuration: HttpClientConfiguration;

  constructor(baseUrl: string, configuration: HttpClientConfiguration) {
    this.baseUrl = baseUrl;
    this.configuration = configuration;
  }

  public path(...paths: string[]): HttpClient {
    this.paths = paths;
    return this;
  }

  public query(param: string, value: any): HttpClient {
    if (!this.params) this.params = {};

    this.params[param] = value;
    return this;
  }

  public payload(payload: any): HttpClient {
    this.body = payload;
    return this;
  }

  public header(header: string, value: string): HttpClient {
    if (!this.headers) this.headers = {};

    this.headers[header] = value;
    return this;
  }

  public authorization(type: string, value: string): HttpClient {
    return this.header('Authorization', `${type} ${value}`);
  }

  public basicAuthorization(user: string, password: string): HttpClient {
    return this.authorization(AuthorizationType.BASIC, Buffer.from(`${user}:${password}`).toString('base64'));
  }

  public bearerAuthorization(value: string): HttpClient {
    return this.authorization(AuthorizationType.BEARER, value);
  }

  public retry(attempt: number, interval: number): HttpClient {
    if (!this.configuration.retry) this.configuration.setRetryStrategy(HttpClientRetryStrategy.create());

    this.configuration.retry.attempt(attempt).interval(interval);

    return this;
  }

  public retryOnHttpStatusCodes(...codes: number[]): HttpClient {
    if (!this.configuration.retry) this.configuration.setRetryStrategy(HttpClientRetryStrategy.create());

    this.configuration.retry.forHttpStatusCodes(...codes);
    return this;
  }

  public retryWhen(validationFn: (statusCode: number) => boolean): HttpClient {
    if (!this.configuration.retry) this.configuration.setRetryStrategy(HttpClientRetryStrategy.create());

    this.configuration.retry.shouldRetryWhen(validationFn);
    return this;
  }

  public get(): HttpClientResponse {
    this.method = HttpMethod.GET;
    return this.createHttpClientResponse();
  }

  public post(): HttpClientResponse {
    this.method = HttpMethod.POST;
    return this.createHttpClientResponse();
  }

  public put(): HttpClientResponse {
    this.method = HttpMethod.PUT;
    return this.createHttpClientResponse();
  }

  public patch(): HttpClientResponse {
    this.method = HttpMethod.PATCH;
    return this.createHttpClientResponse();
  }

  public delete(): HttpClientResponse {
    this.method = HttpMethod.DELETE;
    return this.createHttpClientResponse();
  }

  public getRequestInfo() {
    return {
      baseUrl: this.baseUrl,
      paths: this.paths,
      params: this.params,
      method: this.method,
      body: this.body,
      headers: this.headers,
    };
  }

  private createHttpClientResponse(): HttpClientResponse {
    if (this.configuration.interceptors) this.configuration.interceptors.applyRequestInterceptor(this);

    return new HttpClientResponse(
      this.baseUrl,
      this.paths,
      this.params,
      this.method,
      this.body,
      this.headers,
      this.configuration
    );
  }
}
