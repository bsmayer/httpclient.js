import { AxiosStatic, AxiosResponse, AxiosError } from 'axios'

import RequestSchema from '../schemas/RequestSchema'
import ErrorSchema from '../schemas/ErrorSchema'

export default class AxiosService {
  private axios: AxiosStatic;

  constructor (axios: AxiosStatic) {
    this.axios = axios
  }

  public static create (axios: AxiosStatic): AxiosService {
    return new AxiosService(axios)
  }

  public makeRequest (schema: RequestSchema): Promise<AxiosResponse> {
    return new Promise((resolve, reject): void => {
      this.axios({
        method: schema.method,
        baseURL: schema.baseUrl,
        url: schema.paths,
        data: schema.payload,
        params: schema.params,
        headers: schema.headers
      })
        .then(response => resolve(response))
        .catch((err: AxiosError) => {
          const statusCode = (err.response && err.response.status && err.response.status) || 0
          return reject(ErrorSchema.of(err, statusCode))
        })
    })
  }
}
