import HttpClientConfiguration from './HttpClientConfiguration'
import AxiosService from './rest-clients/AxiosService'
import RequestService from './rest-clients/RequestService'
import HttpMethod from './constants/HttpMethod'

export default class HttpClientResponse {
  private baseUrl: string;
  private paths: string[];
  private params: any;
  private method: HttpMethod;
  private body: any;
  private headers: any;
  private configuration: HttpClientConfiguration;

  constructor (
    baseUrl: string,
    paths: string[],
    params: any[],
    method: HttpMethod,
    body: any,
    headers: any,
    configuration: HttpClientConfiguration
  ) {
    this.baseUrl = baseUrl
    this.paths = paths
    this.params = params
    this.method = method
    this.body = body
    this.headers = headers
    this.configuration = configuration
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
      let responseBody
      let originalResponse

      if (this.configuration.isAxios()) {
        originalResponse = await AxiosService
          .create(this.configuration.client)
          .makeRequest({
            baseUrl: this.baseUrl,
            paths: finalPath,
            method: this.method,
            payload: this.body,
            headers: this.headers,
            params: this.params
          })

        responseBody = originalResponse.data
      } else if (this.configuration.isRequest()) {
        originalResponse = await RequestService
          .create(this.configuration.client)
          .makeRequest({
            baseUrl: this.baseUrl,
            paths: finalPath,
            method: this.method,
            payload: this.body,
            headers: this.headers,
            params: this.params
          })

        responseBody = originalResponse.body
      }

      if (this.configuration.interceptors) {
        const resolvedResponse = this.configuration.interceptors.applyResponseInterceptor(responseBody)
        if (resolvedResponse)
          return resolvedResponse as T
      }

      return responseBody as T
    }).catch(err => {
      if (this.configuration.interceptors) {
        const resolvedError = this.configuration.interceptors.applyErrorInterceptor(err)
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
          if (!this.configuration.retry)
            return reject(err)

          if (attempt >= this.configuration.retry.getAttempts())
            return reject(err)

          if (err.response && err.response.status && !this.configuration.retry.checkIfShouldRetry(err.response.status))
            return reject(err)

          const interval = this.configuration.retry.isExponential()
            ? (2 ^ attempt) * this.configuration.retry.getInterval()
            : this.configuration.retry.getInterval()

          setTimeout(() => {
            return this.fetchRetry(request, attempt + 1)
              .then(res => resolve(res))
              .catch(err => reject(err))
          }, interval)
        })
    })
  }
}
