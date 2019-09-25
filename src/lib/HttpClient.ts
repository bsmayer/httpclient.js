import { Method } from 'axios'

import AuthorizationType from './constants/AuthorizationType'
import HttpClientResponse from './HttpClientResponse'
import HttpClientInterceptors from './HttpClientInterceptors'
import HttpClientRetryStrategy from './HttpClientRetryStrategy'

export default class HttpClient {
  private baseUrl: string;
  private paths!: string[];
  private params: any;
  private method!: Method;
  private body: any;
  private headers: any;
  private interceptors: HttpClientInterceptors;
  private retryConfig: HttpClientRetryStrategy;

  constructor (
    baseUrl: string,
    interceptors: HttpClientInterceptors,
    retryConfig: HttpClientRetryStrategy
  ) {
    this.baseUrl = baseUrl
    this.interceptors = interceptors
    this.retryConfig = retryConfig
  }

  public path (...paths: string[]): HttpClient {
    this.paths = paths
    return this
  }

  public query (param: string, value: any): HttpClient {
    if (!this.params)
      this.params = {}

    this.params[param] = value
    return this
  }

  public payload (payload: any): HttpClient {
    this.body = payload
    return this
  }

  public header (header: string, value: string): HttpClient {
    if (!this.headers)
      this.headers = {}

    this.headers[header] = value
    return this
  }

  public authorization (type: string, value: string): HttpClient {
    return this.header('Authorization', `${type} ${value}`)
  }

  public basicAuthorization (user: string, password: string): HttpClient {
    return this.authorization(AuthorizationType.BASIC, Buffer.from(`${user}:${password}`).toString('base64'))
  }

  public bearerAuthorization (value: string): HttpClient {
    return this.authorization(AuthorizationType.BEARER, value)
  }

  public retryOnHttpStatusCodes (...codes: number[]): HttpClient {
    if (!this.retryConfig)
      this.retryConfig = HttpClientRetryStrategy.create()

    this.retryConfig.forHttpStatusCodes(...codes)
    return this
  }

  public retry (attempt: number, interval: number): HttpClient {
    if (!this.retryConfig)
      this.retryConfig = HttpClientRetryStrategy.create()

    this.retryConfig
      .attempt(attempt)
      .interval(interval)

    return this
  }

  public get (): HttpClientResponse {
    this.method = 'get'
    return this.createHttpClientResponse()
  }

  public post (): HttpClientResponse {
    this.method = 'post'
    return this.createHttpClientResponse()
  }

  public put (): HttpClientResponse {
    this.method = 'put'
    return this.createHttpClientResponse()
  }

  public patch (): HttpClientResponse {
    this.method = 'patch'
    return this.createHttpClientResponse()
  }

  public delete (): HttpClientResponse {
    this.method = 'delete'
    return this.createHttpClientResponse()
  }

  private createHttpClientResponse (): HttpClientResponse {
    if (this.interceptors)
      this.interceptors.applyRequestInterceptor(this)

    return new HttpClientResponse(
      this.baseUrl,
      this.paths,
      this.params,
      this.method,
      this.body,
      this.headers,
      this.interceptors,
      this.retryConfig
    )
  }
}
