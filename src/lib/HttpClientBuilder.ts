import HttpClient from './HttpClient'
import HttpClientInterceptors from './HttpClientInterceptors'

export default class HttpClientBuilder {
  private baseUrl: string;
  private interceptors!: HttpClientInterceptors;

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

  public client (): HttpClient {
    return new HttpClient(this.baseUrl, this.interceptors)
  }
}
