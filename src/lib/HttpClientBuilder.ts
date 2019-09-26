import HttpClient from './HttpClient'
import HttpClientInterceptors from './HttpClientInterceptors'
import HttpClientRetryStrategy from './HttpClientRetryStrategy'

export default class HttpClientBuilder {
  private baseUrl: string;
  private interceptors!: HttpClientInterceptors;
  private retry!: HttpClientRetryStrategy;

  constructor (baseUrl: string) {
    this.baseUrl = baseUrl
  }

  public static create (baseUrl: string): HttpClientBuilder {
    if (!baseUrl)
      throw new Error('You must provide a base url')

    return new HttpClientBuilder(baseUrl)
  }

  public useInterceptors (interceptors: HttpClientInterceptors): HttpClientBuilder {
    this.interceptors = interceptors
    return this
  }

  public useRetryStrategy (retry: HttpClientRetryStrategy): HttpClientBuilder {
    this.retry = retry
    return this
  }

  public use (config: HttpClientInterceptors | HttpClientRetryStrategy): HttpClientBuilder {
    if (config instanceof HttpClientInterceptors) {
      this.interceptors = config
    } else if (config instanceof HttpClientRetryStrategy) {
      this.retry = config
    }
    return this
  }

  public client (): HttpClient {
    return new HttpClient(this.baseUrl, this.interceptors, this.retry)
  }
}
