import { HttpClientBuilder, HttpClientInterceptors, HttpClientRetryStrategy } from '../src'

function test (username: string): Promise<any> {
  const interceptors = HttpClientInterceptors.create()
    .useResponseInterceptor((response: any) => response.name)

  const retry = HttpClientRetryStrategy.create()
    .forHttpStatusCodes(500, 510, 520, 530)
    .attempt(3)
    .interval(1000)
    .useExponentialStrategy()

  const builder = HttpClientBuilder.create('https://api.github.com')
    .useInterceptors(interceptors)
    .use(retry)

  return builder.client()
    .path('users', username)
    .get()
    .getResponse()
}

test('bsmayer').then(response => console.log(response)).catch(err => console.log(err.message))
