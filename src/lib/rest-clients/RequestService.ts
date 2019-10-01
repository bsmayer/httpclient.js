import { RequestAPI, Request, CoreOptions, RequiredUriUrl, Response } from 'request'

import RequestSchema from '../models/RequestSchema'
import ErrorSchema from '../models/ErrorSchema'

export default class RequestService {
  private request: RequestAPI<Request, CoreOptions, RequiredUriUrl>;

  constructor (request: RequestAPI<Request, CoreOptions, RequiredUriUrl>) {
    this.request = request
  }

  public static create (request: RequestAPI<Request, CoreOptions, RequiredUriUrl>): RequestService {
    return new RequestService(request)
  }

  public makeRequest (schema: RequestSchema): Promise<Response> {
    return new Promise((resolve, reject): void => {
      this.request(
        schema.baseUrl + schema.paths,
        {
          method: schema.method,
          headers: schema.headers,
          body: schema.payload,
          qs: schema.params
        },
        (err, response) => {
          if (err)
            return reject(ErrorSchema.of(err, response.statusCode))
          return resolve(response)
        }
      )
    })
  }
}
