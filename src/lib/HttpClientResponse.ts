import HttpClientConfiguration from './HttpClientConfiguration';
import AxiosService from './services/AxiosService';
import RequestService from './services/RequestService';
import FetchService from './services/FetchService';
import GotService from './services/GotService';
import HttpMethod from './constants/HttpMethod';
import { runInThisContext } from 'vm';

export default class HttpClientResponse {
  private baseUrl: string;
  private paths: string[];
  private params: any;
  private method: HttpMethod;
  private body: any;
  private headers: any;
  private configuration: HttpClientConfiguration;

  constructor(
    baseUrl: string,
    paths: string[],
    params: any[],
    method: HttpMethod,
    body: any,
    headers: any,
    configuration: HttpClientConfiguration
  ) {
    this.baseUrl = baseUrl;
    this.paths = paths;
    this.params = params;
    this.method = method;
    this.body = body;
    this.headers = headers;
    this.configuration = configuration;
  }

  public async getResponse<T>(): Promise<T> {
    if (this.baseUrl.endsWith('/')) {
      this.baseUrl = this.baseUrl.substring(0, this.baseUrl.length - 1);
    }

    const finalPath = this.paths.reduce((path, curr) => {
      if (!curr) throw Error('There is a problem with your path, received undefined value');

      if (!curr.startsWith('/')) {
        curr += '/';
      }
      if (curr.endsWith('/')) {
        curr = curr.substring(0, curr.length - 1);
      }
      return path + '/' + curr;
    }, '');

    const request = {
      baseUrl: this.baseUrl,
      paths: finalPath,
      method: this.method,
      payload: this.body,
      headers: this.headers,
      params: this.params,
    };

    return this.fetchRetry<T>(
      async (): Promise<T> => {
        let responseBody;
        let originalResponse;

        if (this.configuration.isAxios()) {
          originalResponse = await AxiosService.create(this.configuration.client).makeRequest(request);

          responseBody = originalResponse.data;
        } else if (this.configuration.isRequest()) {
          originalResponse = await RequestService.create(this.configuration.client).makeRequest(request);

          responseBody = JSON.parse(originalResponse.body);
        } else if (this.configuration.isGot()) {
          originalResponse = await GotService.create(this.configuration.client).makeRequest(request);

          responseBody = JSON.parse(originalResponse.body);
        } else {
          originalResponse = await FetchService.makeRequest(request);
          responseBody = JSON.parse(originalResponse.body);
        }

        if (this.configuration.interceptors && this.configuration.interceptors.hasResponseInterceptor()) {
          const resolvedResponse = this.configuration.interceptors.applyResponseInterceptor(
            responseBody,
            originalResponse
          );

          if (resolvedResponse) {
            return resolvedResponse as T;
          } else {
            return resolvedResponse;
          }
        }

        return responseBody as T;
      }
    ).catch(err => {
      if (this.configuration.interceptors) {
        const resolvedError = this.configuration.interceptors.applyErrorInterceptor(err.originalError || err);
        if (resolvedError) return resolvedError;
      }

      throw err.originalError || err;
    });
  }

  private fetchRetry<T>(request: () => Promise<T>, attempt = 1): Promise<T> {
    return new Promise<T>((resolve, reject): void => {
      request()
        .then(response => resolve(response))
        .catch(err => {
          if (!this.configuration.retry) return reject(err);

          if (attempt >= this.configuration.retry.getAttempts()) return reject(err);

          if (err.statusCode && !this.configuration.retry.checkIfShouldRetry(err.statusCode))
            return reject(err.originalError);

          const interval = this.configuration.retry.isExponential()
            ? (2 ^ attempt) * this.configuration.retry.getInterval()
            : this.configuration.retry.getInterval();

          setTimeout(() => {
            return this.fetchRetry(request, attempt + 1)
              .then(res => resolve(res))
              .catch(err => reject(err));
          }, interval);
        });
    });
  }
}
