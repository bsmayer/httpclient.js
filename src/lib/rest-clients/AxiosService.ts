import { AxiosStatic, AxiosResponse } from 'axios'

import RequestSchema from '../models/RequestSchema'

export default class AxiosService {
  private axios: AxiosStatic;

  constructor (axios: AxiosStatic) {
    this.axios = axios
  }

  public static create (axios: AxiosStatic): AxiosService {
    return new AxiosService(axios)
  }

  public makeRequest (schema: RequestSchema): Promise<AxiosResponse> {
    return this.axios({
      method: schema.method,
      baseURL: schema.baseUrl,
      url: schema.paths,
      data: schema.payload,
      params: schema.params,
      headers: schema.headers
    })
  }
}
