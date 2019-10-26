import { GotInstance, Response } from 'got'

import RequestSchema from '../schemas/RequestSchema'
import ErrorSchema from '../schemas/ErrorSchema'

export default class GotService {
  private got: GotInstance

  constructor (got: GotInstance) {
    this.got = got
  }

  public static create (got: GotInstance): GotService {
    return new GotService(got)
  }

  public makeRequest (schema: RequestSchema): Promise<Response<string>> {
    return new Promise((resolve, reject): void => {
      const instance = this.got.extend({
        baseUrl: schema.baseUrl,
        headers: schema.headers,
        body: schema.payload,
        method: schema.method,
        path: schema.paths,
        query: schema.params,
      })

      instance(schema.baseUrl)
        .then(response => resolve(response))
        .catch(err => reject(ErrorSchema.of(err, err.statusCode)))
    })
  }
}
