import axios, { Method } from 'axios'

import HttpClientInterceptors from './HttpClientInterceptors'
import HttpClientRetryStrategy from './HttpClientRetryStrategy'

export default class HttpClientResponse {
  private baseUrl: string;
  private paths: string[];
  private params: any;
  private method: Method;
  private body: any;
  private headers: any;
  private interceptors: HttpClientInterceptors;
  private retryConfig: HttpClientRetryStrategy;

  constructor (
    baseUrl: string,
    paths: string[],
    params: any[],
    method: Method,
    body: any,
    headers: any,
    interceptors: HttpClientInterceptors,
    retryConfig: HttpClientRetryStrategy
  ) {
    this.baseUrl = baseUrl
    this.paths = paths
    this.params = params
    this.method = method
    this.body = body
    this.headers = headers
    this.interceptors = interceptors
    this.retryConfig = retryConfig
  }

  public async getResponse<T> (): Promise<T> {
    if (this.baseUrl.endsWith('/')) {
      this.baseUrl = this.baseUrl.substring(0, this.baseUrl.length - 1)
    }

    const finalPath = this.paths.reduce((path, curr) => {
      if (!curr.startsWith('/')) {
        curr += '/'
      }
      if (curr.endsWith('/')) {
        curr = curr.substring(0, curr.length - 1)
      }
      return path + '/' + curr
    }, '')

    return this.fetchRetry<T>(async (): Promise<T> => {
      const response = await axios({
        method: this.method,
        baseURL: this.baseUrl,
        url: finalPath,
        data: this.body,
        params: this.params,
        headers: this.headers
      })

      if (this.interceptors) {
        const resolvedResponse = this.interceptors.applyResponseInterceptor(response.data)
        if (resolvedResponse)
          return resolvedResponse as T
      }

      return response.data as T
    }).catch(err => {
      if (this.interceptors) {
        const resolvedError = this.interceptors.applyErrorInterceptor(err)
        if (resolvedError)
          return resolvedError
      }

      throw err
    })
  }

  private fetchRetry<T> (request: () => Promise<T>, attempt = 1): Promise<T> {
    return new Promise<T>((resolve, reject): void => {
      request()
        .then(response => resolve(response))
        .catch(err => {
          if (!this.retryConfig)
            return reject(err)

          if (attempt >= this.retryConfig.getAttempts())
            return reject(err)

          if (err.response && err.response.status && !this.retryConfig.checkIfShouldRetry(err.response.status))
            return reject(err)

          setTimeout(() => {
            return this.fetchRetry(request, attempt + 1)
              .then(res => resolve(res))
              .catch(err => reject(err))
          }, this.retryConfig.getInterval() * (this.retryConfig.isExponential() ? attempt + 1 : 1))
        })
    })
  }
}
