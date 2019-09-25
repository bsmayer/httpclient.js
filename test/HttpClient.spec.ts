import {
  HttpClientInterceptors,
  HttpClientBuilder,
  HttpClientResponse
} from '../src'

describe('HttpClient', () => {
  const client = HttpClientBuilder
    .create('http://url')
    .useInterceptors(HttpClientInterceptors.create())
    .client()

  it('should set the paths', () => {
    client.path('users', '123', 'posts')
    expect((client as any).paths.length).toEqual(3)
    expect((client as any).paths[0]).toEqual('users')
    expect((client as any).paths[1]).toEqual('123')
    expect((client as any).paths[2]).toEqual('posts')
  })

  it('should set a new param', () => {
    client.query('sortBy', 'name')
    expect((client as any).params).toHaveProperty('sortBy')
    expect((client as any).params.sortBy).toEqual('name')
  })

  it('should set a payload', () => {
    client.payload({ name: 'Jane Doe' })
    expect((client as any).body).toHaveProperty('name')
    expect((client as any).body.name).toEqual('Jane Doe')
  })

  it('should set a new header', () => {
    client.header('token', '123456')
    expect((client as any).headers).toHaveProperty('token')
    expect((client as any).headers.token).toEqual('123456')
  })

  it('should set a method GET and return a new HttpClientResponse', () => {
    const response = client.get()
    expect((client as any).method).toEqual('get')
    expect(response).toBeDefined()
    expect(response).toBeInstanceOf(HttpClientResponse)
  })

  it('should set a method POST and return a new HttpClientResponse', () => {
    const response = client.post()
    expect((client as any).method).toEqual('post')
    expect(response).toBeDefined()
    expect(response).toBeInstanceOf(HttpClientResponse)
  })

  it('should set a method PUT and return a new HttpClientResponse', () => {
    const response = client.put()
    expect((client as any).method).toEqual('put')
    expect(response).toBeDefined()
    expect(response).toBeInstanceOf(HttpClientResponse)
  })

  it('should set a method DELETE and return a new HttpClientResponse', () => {
    const response = client.delete()
    expect((client as any).method).toEqual('delete')
    expect(response).toBeDefined()
    expect(response).toBeInstanceOf(HttpClientResponse)
  })

  it('should set a method PATCH and return a new HttpClientResponse', () => {
    const response = client.patch()
    expect((client as any).method).toEqual('patch')
    expect(response).toBeDefined()
    expect(response).toBeInstanceOf(HttpClientResponse)
  })
})
