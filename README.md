<div align="center">
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <img src="./docs/logo.png" alt="HTTPCLIENT.JS - Rest made simple, robust and intuitive" />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
</div>


[![npm version](https://badge.fury.io/js/httpclient.js.svg)](https://badge.fury.io/js/httpclient.js)

Friendly wrapper to use with your favorite rest client in your Javascript projects. Through intuitive builders, you can make your requests looking much more readable, isolating your configuration and creating robust api calls without having to worry about the library you're using. 

Because we :heart: __axios__, this library is shipped with it already, but you're free to use your own instance of any of our supported clients.

Currently supported libraries are:
- axios (https://github.com/axios/axios)
- request (https://github.com/request/request)
- got (https://github.com/sindresorhus/got)

We strongly recommend the use of this library with __Typescript__.

# Benefits 

- No more complex configuration objects
- Any library, same syntax
- Cleaner builder for complex queries
- Isolation of configuration
- Retry strategy made easy, for global or individual request
- Interceptors for requests, response and errors
- Shipped with defaults for simple case uses

# Motivation

With the large amount of rest clients out there, choosing between them can be quite painful. But we all have the right to use our favorites, right? __The problem is__, none of them have the same syntax or use the same approach for handling errors. Also, creating middleware is not that intuitive and making complex requests can become not as readable as we want. 

So, what if we could always use the same code, no matter what rest client we're using, with a nice query builder? 

__That's the main idea of HTTPCLIENT.JS__ - This is not another rest client. This is a wrapper for improving the creating of your requests and the readability of your code, while working with the well known and solid rest clients out there.

# Installation

```bash
yarn add httpclient.js
```

Or

```bash
npm install httpclient.js --save
```

# Getting started

If you want to have a quick start with zero configuration, you're at the right place. Check out this simple example.

```ts
import { HttpClientBuilder } from 'httpclient.js'

interface User {
  id: string;
  login: string;
  name: string;
  avatar_url: string;
}

export default class GithubService {
  private api: HttpClientBuilder

  constructor() {
    this.api = HttpClientBuilder.create('https://api.github.com')
  }

  public async getUser(username: string): Promise<User> {
    return await this.api.client()
      .path('users', username)
      .get()
      .getResponse<User>();
  }
}
```

Looks simple, because it is. The code speaks for itself. With zero configuration, you're already able to make your queries using a smooth builder and get your response converted to your type. 

# Building requests

Before you start composing your request, you need to create a new instance of `HttpClientBuilder`. This class is responsible for storing your configuration and pass along to your requests. You can have as many __HttpClientBuilder__ instances as you want, but normally we keep it inside a separate file in the root of our application, so that we can use the same instance every time we need to make a new request.

# 

## 1. `HttpClientBuilder`

### __.create(base_url)__

Create a new instance of `HttpClientBuilder`, passing the base URL of your api. This will enable the other configuration options. 

### __.useAxios(axios)__

This method allows the use of your own instance of __axios__. However, it doesn't mean that you need to. This library ships with axios by default, however we understand that you're probably want to be in control of it.

```ts
import axios from 'axios'

HttpClientBuilder.create()
  .useAxios(axios)
```

### __.useRequest(request)__

This method allows the use of your own instance of __request__ (https://github.com/request/request). Setting this method will make your requests to be fired using request instead of axios.

```ts
import request from 'request'

HttpClientBuilder.create()
  .useRequest(request)
```

### __.useGot(got)__

This method allows the use of your own instance of __got__ (github.com/sindresorhus/got). Setting this method will make your requests to be fired using got instead of axios.

```ts
import got from 'gpt'

HttpClientBuilder.create()
  .useGot(got)
```

### __.useInterceptors(interceptors)__

By using this method you're able to inject your interceptors as middlewares. Interceptors are instance of `HttpClientInterceptors` and you can read more about them below. This library does not ship with default interceptors.

### __.useRetryStrategy(retry)__

This method enable the retry strategy in all of your requests. It receives an instance of `HttpClientRetryStrategy` and you can read more about it below. 

### __.client()__

This method retrieves a new instance of `HttpClient` class. By calling this function you will be able to start making your queries. Normally, for each query we're doing, we need to retrieve a new instance of the client. 

#

## 2. `HttpClient`

### __.path(...paths)__

This is normally the first method we call after retrieving a new client. Here you pass as many paths as you want. For instance: 

```ts
this.api.client()
  .path('path_1', 'path_2', 'path_3')
```

Later it will be translated to `path_1/path_2/path_3`.

### __.query(name, value)__

Sets a new query string, receiving the name of your querystring, followed by the value. 

```ts
this.api.client()
  .query('name', 'John Doe')
  .query('sort_by', 'age')
```

You can pass as many querystrings as you want.

### __.payload(obj)__

Specify the payload that will be sent to the API. It should be a Javascript object. 

```ts
this.api.client()
  .payload({
    name: 'John Doe',
    age: 25,
    newsletter: true
  })
```

### __.header(name, value)__

Sets a new header to your request, receiving a name and a value. You can have as many headers as you want.

```ts
this.api.client()
  .header('x-ip', '192.168.0.1')
  .header('x-username', 'john_doe')
```

### __.authorization(type, value)__

Sets a new Authorization header to your request. It receives a type (Basic, Bearer, etc) and a value.

```ts
this.api.client()
  .authorization('Basic', Buffer.from('username:password').toString('base64'))
```

### __.basicAuthorization(username, password)__

Sets a new Basic Authorization header to your request, receiving a username and password. This method transforms the `username:password` to a base64 string before sending to the server.

```ts
this.api.client()
  .basicAuthorization('john_doe', 'secure_password')
```

### __.bearerAuthorization(value)__

Sets a new Bearer Authorization header, receiving the token.

```ts
this.api.client()
  .bearerAuthorization('JWT_HERE')
```

### __.retry(max_attempts, interval_in_ms)__

Using this method you're enabling retry strategy for this request only. If you already set a retry strategy before using `HttpClientRetryStrategy`, it will override it.

The first parameter tells how many times we want to retry. The second parameter tells the interval between retries in milliseconds.

```ts
this.api.client()
  .retry(3, 1000)
```

### __.retryOnHttpStatusCodes(...codes)__

Enables retry strategy for this request only, manually passing the HTTP status codes that it should retry in case of failure. 

```ts
this.api.client()
  .retryOnHttpStatusCodes(500, 501, 502, 503)
```

### __.retryWhen(status_code => {})__

Similar to `.retryOnHttpStatusCodes`, but with `.retryWhen` you can pass a function which receives the status code and determine if we need to retry or not. 

```ts
this.api.client()
  .retryWhen(statusCode => statusCode >= 500 || statusCode !== 401)
```

### __.get()__

Sets HTTP GET to the request.

### __.post()__

Sets HTTP POST to the request.

### __.put()__

Sets HTTP PUT to the request.

### __.patch()__

Sets HTTP PATCH to the request.

### __.delete()__

Sets HTTP DELETE to the request.

### __.getResponse()__

This is the last method enabled in the builder. Once you call it, your request will be fired and the magic will start to happen. 

If you're using Typescript, you can specify your return type using `.getResponse<YourType>()`.

# Interceptors

Interceptors are used like middlewares between the steps of the request. setting up interceptors is made by using `HttpClientInterceptors` class. This class has its own builder, making it possible to set up interceptors in a way as natural as making requests.

## They are mostly useful when:
- You want to inject a header or any default setting before firing the request.
- You have a default response wrapper returning from your APIs and you want to grab a property from that.
- You want to change your response before returning to the method.
- You want to grab an error and do something about it.
- You simply want to log or track your requests

#

## 3. `HttpClientInterceptors`

### __.create()__

Retrieves a new instance of `HttpClientInterceptors`.

### __.useRequestInterceptor((http_client) => {})__

This interceptor is called right before firing the request. This is your last opportunity to change something in your request. It receives the current `HttpClient` as a parameter.

```ts
HttpClientInterceptors.create()
  .useRequestInterceptor((client: HttpClient) => {
    client.header('role', 'read_only')
  })
```

### __.useResponseInterceptor((response_body, original_client_response) => {})__

This interceptor is called after receiving a successful response from the API. It receives the response body and optionally the full original response from the configured client. Any changes you make on it, will be applied before returning to your method. 

If you're using this interceptor with Typescript, you can provide your response type by calling `.useResponseInterceptor<YourResponseType>((response: YourResponseType) => {})`.

So let's suppose we have a default API response wrapper with the following structure:

```ts
interface ApiResponse<T> {
  return: T;
  error: string;
  success: boolean;
}
```

With the response interceptor you could easily grab your response like this.

```ts
HttpClientInterceptors.create()
  .useResponseInterceptor<ApiResponse<any>>(response => response.return)
```

### __.useErrorInterceptor((error) => {})__

This method receives as a parameter the full error from your chosen client. Since we use __axios__, by default an instance of __AxiosError__ is passed. 

__Important:__ If you return something from this method, we're also going to consider the error as resolved. It means that we're already catching the error for you. But instead, if you don't return anything from it, we will execute the method and throw the original exception.

For instance, the code below would not throw an Error when the status code is `404`. For the other status codes it would just log the problem and throw the original error. 

```ts
HttpClientInterceptors.create()
  .useErrorInterceptor<AxiosError>((error: AxiosError) => {
    Logger.log('Something wrong happened!', error.message)

    if (error.response.status === 404) {
      return { redirect_to: '/Home' }
    }
  })
```

## __Full usage example__

```ts
import { HttpClientInterceptors, HttpClientBuilder } from 'httpclient.js'

const interceptors = HttpClientInterceptors.create()
  .useRequestInterceptor(client => client.header('x-role', 'admin'))
  .useResponseInterceptor<ApiResponse<any>>(response => response.return)
  .useErrorInterceptor<AxiosError>(err => Logger.error(err.message))

const builder = HttpClientBuilder.create()
  .useInterceptors(interceptors)

export default builder
```

# Retry Strategy

When working with APIs, having resilience in your requests is really important. We don't always know when an endpoint is over its limits or down, but we still rely on that information. There are many resilience concepts, and a common one is the __retry strategy__, and you can set up your own retry strategy by using `HttpClientRetryStrategy` class. 

#

## 4. `HttpClientRetryStrategy`

### __.create()__

Retrieves a new instance of `HttpClientRetryStrategy` class.

### __.attempt(max_attempts)__

Sets the maximum number of attempts that you want to retry the request before returning an error. __The default value is 3__.

### __.interval(interval_in_ms)__

Sets the interval between your requests in milliseconds.

If you're using exponential rule (enabled by default), the interval will be the result of: __2 ^ current_attempt * interval__. For instance, let's suppose you set up your retry rule for a max number of 3 attempts with 1000 ms, the wait would be:

- (2 ^ 1) * 1000 = 2000 ms = 2 seconds
- (2 ^ 2) * 1000 = 4000 ms = 4 seconds
- (2 ^ 3) * 1000 = 8000 ms = 8 seconds

In case of a non-exponential rule, the interval will be equally respected between all attempts.

### __.forHttpStatusCodes(...codes)__

Sets the HTTP status code that you want to consider retrying. 

```ts
HttpClientRetryStrategy.create()
  .forHttpStatusCodes(500, 503, 504)
```

### __.shouldRetryWhen((status_code) => {})__

Similar to `.forHttpStatusCodes()`, but instead of passing all the status codes manually, you provide a validation function that returns a boolean. In case of `true`, it will retry. 

```ts
HttpClientRetryStrategy.create()
  .shouldRetryWhen(statusCode => statusCode >= 500 || statusCode === 404)
```

### __.useExponentialStrategy(true|false)__

Indicates if it should use the exponential rule for the next attempts. __Default: true__.

```ts
HttpClientRetryStrategy.create()
  .useExponentialStrategy(false)
```

# Try out yourself

This library makes possible the separation between configuration and requests, but each case is a different case and only you know the best way to use it within your scenario. 

However, the code below is a full example of how you can use this library.

## config/api.js

```ts
import { 
  HttpClientBuilder, 
  HttpClientInterceptors, 
  HttpClientRetryStrategy 
} from 'httpclient.js'

// Setting up interceptors
const interceptors = HttpClientInterceptors.create()
  .useResponseInterceptor<ApiResponse<any>>((response: ApiWrapper<any>) => response.return)
  .useErrorInterceptor(err => console.log(err.message))

// Setting up the retry strategy
const retry = HttpClientRetryStrategy.create()
  .shouldRetryWhen((statusCode: number) => statusCode >= 500 || statusCode === 404)
  .attempt(3)
  .interval(1000)
  .useExponentialSrategy();

// Creating the builder
const builder = HttpClientBuilder.create('https://api.github.com')
  .useInterceptors(interceptors)
  .useRetryStrategy(retry);

export default builder;
```

## services/user.ts

```typescript
import api from '../config/api';

export interface User {
  id: string;
  login: string;
  name: string;
  avatar_url: string;
}

export default class UserService {
  async function getUser(username: string): Promise<User> {
    return await api.client()
      .path('users', username)
      .get()
      .getResponse<User>();
  }
}
```

# Contribute

If you like this library and idea, you can help us implementing new features and finding bugs (or at least give us a star). Feel free to send a PR and open new issues. 

Special thanks to __@wesleyegberto__ who created a version of this library for .NET Core.

Github: https://github.com/wesleyegberto

Library: https://github.com/wesleyegberto/csharp-rest-client

## Cheers!




