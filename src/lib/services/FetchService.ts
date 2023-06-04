require('isomorphic-fetch');

import RequestSchema from '../schemas/RequestSchema';
import ErrorSchema from '../schemas/ErrorSchema';

export default class FetchService {
  public static makeRequest(schema: RequestSchema): Promise<any> {
    return new Promise((resolve, reject): void => {
      fetch(new URL(schema.paths + this.paramsToQueryString(schema.params), schema.baseUrl).toString(), {
        body: schema.payload,
        headers: schema.headers,
        method: schema.method,
      })
        .then((response: Response) => {
          response.text().then((body: string) => {
            if (response.ok) {
              resolve({
                body,
                headers: response.headers,
                status: response.status,
                statusText: response.statusText,
              });
            } else {
              reject(ErrorSchema.of(body, response.status));
            }
          });
        })
        .catch((error: Error) => ErrorSchema.of(error, 0));
    });
  }

  private static paramsToQueryString(params: any): string {
    if (!params) {
      return '';
    }
    return (
      '?' +
      Object.keys(params)
        .map((param: string) => `${param}=${params[param]}`)
        .join('&')
    );
  }
}
