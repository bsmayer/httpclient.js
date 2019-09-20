import nock from 'nock'
import { HttpClientBuilder, HttpClientInterceptors } from '../src'

describe('HttpClientResponse', () => {
  const interceptors = HttpClientInterceptors.create()
    .useErrorInterceptor(err => {
      if (err.response) {
        switch (err.response.status) {
          case 401:
            return { message: 'its ok, let it pass' }
          case 404:
            throw new Error('404 error, shit!')
        }
      }
      throw new Error(err.message)
    })
    .useResponseInterceptor<any>(response => {
      if (response && response.return)
        return response.return
    })

  beforeEach(() => {
    nock('http://api.github.com')
      .get('/users/bsmayer/repos')
      .reply(200, {
        name: 'Bruno Mayer',
        username: 'bsmayer',
        repos: []
      })

    nock('http://api.github.com')
      .get('/users/throw/401')
      .reply(401)

    nock('http://api.github.com')
      .get('/users/throw/404')
      .reply(404)

    nock('http://api.github.com')
      .get('/users/200')
      .reply(200, {
        success: true,
        return: {
          name: 'Bruno Mayer'
        },
        error: null
      })
  })

  it('should call the api and return 200 with a body', async () => {
    const client = HttpClientBuilder
      .create('http://api.github.com')
      .client()

    const response = await client
      .path('users', 'bsmayer', 'repos')
      .get()
      .getResponse<any>()

    expect(response).toBeDefined()
    expect(response.name).toEqual('Bruno Mayer')
    expect(response.username).toEqual('bsmayer')
  })

  it('should intercept error and not throw', async () => {
    const response = await HttpClientBuilder
      .create('http://api.github.com')
      .useInterceptors(interceptors)
      .client()
      .path('users', 'throw', '401')
      .get()
      .getResponse<any>()

    expect(response).toBeDefined()
    expect(response.message).toEqual('its ok, let it pass')
  })

  it('should intercept the error and throw', () => {
    HttpClientBuilder
      .create('http://api.github.com')
      .useInterceptors(interceptors)
      .client()
      .path('users', 'throw', '404')
      .get()
      .getResponse<any>()
      .catch(err => expect(err.message).toEqual('404 error, shit!'))
  })

  it('should intercept the response and get the main object', async () => {
    const response = await HttpClientBuilder
      .create('http://api.github.com')
      .useInterceptors(interceptors)
      .client()
      .path('users', '200')
      .get()
      .getResponse<any>()

    expect(response.name).toEqual('Bruno Mayer')
  })
})
