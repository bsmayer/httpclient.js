import axios, { Method, AxiosResponse } from 'axios'

import HttpClientInterceptors from './HttpClientInterceptors'

export default class HttpClientResponse {
  private baseUrl: string;
  private paths: string[];
  private params: any;
  private method: Method;
  private body: any;
  private headers: any;
  private interceptors: HttpClientInterceptors;

  constructor (
    baseUrl: string,
    paths: string[],
    params: any[],
    method: Method,
    body: any,
    headers: any,
    interceptors: HttpClientInterceptors
  ) {
    this.baseUrl = baseUrl
    this.paths = paths
    this.params = params
    this.method = method
    this.body = body
    this.headers = headers
    this.interceptors = interceptors
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

    let response: AxiosResponse
    try {
      response = await axios({
        method: this.method,
        baseURL: this.baseUrl,
        url: finalPath,
        data: this.body,
        params: this.params,
        headers: this.headers
      })
    } catch (err) {
      if (this.interceptors) {
        const resolvedError = this.interceptors.applyErrorInterceptor(err)
        if (resolvedError)
          return resolvedError
      }

      throw err
    }

    if (this.interceptors) {
      const resolvedResponse = this.interceptors.applyResponseInterceptor(response.data)
      if (resolvedResponse)
        return resolvedResponse as T
    }

    return response.data as T
  }
}
