import { HttpClientBuilder, HttpClientInterceptors, HttpClient } from '../src'

describe('HttpClientBuilder', () => {
  it('should set base url', () => {
    const url = 'http://url'
    const builder = HttpClientBuilder.create(url)
    expect((builder as any).baseUrl).toEqual(url)
  })

  it('should not create the builder without a base url', () => {
    expect(() => {
      HttpClientBuilder.create('')
    }).toThrowError()
  })

  it('should set the interceptors', () => {
    const builder = HttpClientBuilder
      .create('http://url')
      .useInterceptors(HttpClientInterceptors.create())
    expect((builder as any).interceptors).not.toBeNull()
    expect((builder as any).interceptors).toBeDefined()
  })

  it('should create a new HttpClient', () => {
    const url = 'http://url'
    const builder = HttpClientBuilder
      .create(url)
      .useInterceptors(HttpClientInterceptors.create())
    const client = builder.client()
    expect(client).toBeInstanceOf(HttpClient)
    expect((client as any).baseUrl).toEqual(url)
    expect((client as any).interceptors).toBeDefined()
  })
})
