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

**Please note:** From the version 3.1.0 we've dropped support for `request`. Make sure to update your project to one of the supported rest clients.<br /><br />

Friendly wrapper to use with your favorite rest client in your Javascript projects. Through intuitive builders, you can make your requests looking much more readable, isolating your configuration and creating robust api calls without having to worry about the library you're using.

Because we :heart: **axios**, this library is shipped with it already, but you're free to use your own instance of any of our supported clients.

Currently supported libraries are:

- axios (https://github.com/axios/axios)
- got (https://github.com/sindresorhus/got)
- fetch (https://github.com/matthew-andrews/isomorphic-fetch)

We strongly recommend the use of this library with **Typescript**.

# Benefits

- No more complex configuration objects
- Any library, same syntax
- Cleaner builder for complex queries
- Isolation of configuration
- Retry strategy made easy, for global or individual request
- Interceptors for requests, response and errors
- Shipped with defaults for simple case uses

# Motivation

With the large amount of rest clients out there, choosing between them can be quite painful. But we all have the right to use our favorites, right? **The problem is**, none of them have the same syntax or use the same approach for handling errors. Also, creating middlewares is not that intuitive and making complex requests can become not as readable as we want.

So, what if we could always use the same code, no matter what rest client we're using, with a nice query builder?

**That's the main idea of HTTPCLIENT.JS** - This is not another rest client. This is a wrapper for improving the creation of your requests and the readability of your code, while working with the well known and solid rest clients out there.

# Installation

```bash
yarn add httpclient.js
```

Or

```bash
npm install httpclient.js --save
```

Also, if you're not using Axios (or if you want to control the axios version yourself), make sure to add to your project one of the supported rest clients.

# Getting started

If you want to have a quick start with zero configuration, you're at the right place. Check out this simple example.

```ts
import { HttpClientBuilder } from 'httpclient.js';

interface User {
  id: string;
  login: string;
  name: string;
  avatar_url: string;
}

export default class GithubService {
  private api: HttpClientBuilder;

  constructor() {
    this.api = HttpClientBuilder.create('https://api.github.com');
  }

  public async getUser(username: string): Promise<User> {
    return await this.api
      .client()
      .path('users', username)
      .get()
      .getResponse<User>();
  }
}
```

Looks simple, because it is. The code speaks for itself. With zero configuration, you're already able to make your queries using a smooth builder and get your response converted to your type.

# Building requests

Before you start composing your request, you need to create a new instance of `HttpClientBuilder`. This class is responsible for storing your configuration and pass along to your requests. You can have as many **HttpClientBuilder** instances as you want, but normally we keep it inside a separate file in the root of our application, so that we can use the same instance every time we need to make a new request.

#

## 1. `HttpClientBuilder`

### **.create(base_url)**

Create a new instance of `HttpClientBuilder`, passing the base URL of your api. This will enable the other configuration options.

### **.useAxios(axios)**

This method allows the use of your own instance of **axios**. However, it doesn't mean that you need to. This library ships with axios by default, however we understand that you're probably want to be in control of it.

```ts
import axios from 'axios';

HttpClientBuilder.create().useAxios(axios);
```

### **.useRequest(request)**

This method allows the use of your own instance of **request** (https://github.com/request/request). Setting this method will make your requests to be fired using request instead of axios.

```ts
import request from 'request';

HttpClientBuilder.create().useRequest(request);
```

### **.useGot(got)**

This method allows the use of your own instance of **got** (github.com/sindresorhus/got). Setting this method will make your requests to be fired using got instead of axios.

```ts
import got from 'got';

HttpClientBuilder.create().useGot(got);
```

### **.useFetch()**

We ship this library with **fetch**, however it's not default (yet?). If you wish to use **fetch**, follow the solution below.

```ts
HttpClientBuilder.create().useFetch();
```

### **.useInterceptors(interceptors)**

By using this method you're able to inject your interceptors as middlewares. Interceptors are instance of `HttpClientInterceptors` and you can read more about them below. This library does not ship with default interceptors.

### **.useRetryStrategy(retry)**

This method enable the retry strategy in all of your requests. It receives an instance of `HttpClientRetryStrategy` and you can read more about it below.

### **.client()**

This method retrieves a new instance of `HttpClient` class. By calling this function you will be able to start making your queries. Normally, for each query we're doing, we need to retrieve a new instance of the client.

#

## 2. `HttpClient`

### **.path(...paths)**

This is normally the first method we call after retrieving a new client. Here you pass as many paths as you want. For instance:

```ts
this.api.client().path('path_1', 'path_2', 'path_3');
```

Later it will be translated to `path_1/path_2/path_3`.

### **.query(name, value)**

Sets a new query string, receiving the name of your querystring, followed by the value.

```ts
this.api
  .client()
  .query('name', 'John Doe')
  .query('sort_by', 'age');
```

You can pass as many querystrings as you want.

### **.payload(obj)**

Specify the payload that will be sent to the API. It should be a Javascript object.

```ts
this.api.client().payload({
  name: 'John Doe',
  age: 25,
  newsletter: true,
});
```

### **.header(name, value)**

Sets a new header to your request, receiving a name and a value. You can have as many headers as you want.

```ts
this.api
  .client()
  .header('x-ip', '192.168.0.1')
  .header('x-username', 'john_doe');
```

### **.authorization(type, value)**

Sets a new Authorization header to your request. It receives a type (Basic, Bearer, etc) and a value.

```ts
this.api.client().authorization('Basic', Buffer.from('username:password').toString('base64'));
```

### **.basicAuthorization(username, password)**

Sets a new Basic Authorization header to your request, receiving a username and password. This method transforms the `username:password` to a base64 string before sending to the server.

```ts
this.api.client().basicAuthorization('john_doe', 'secure_password');
```

### **.bearerAuthorization(value)**

Sets a new Bearer Authorization header, receiving the token.

```ts
this.api.client().bearerAuthorization('JWT_HERE');
```

### **.retry(max_attempts, interval_in_ms)**

Using this method you're enabling retry strategy for this request only. If you already set a retry strategy before using `HttpClientRetryStrategy`, it will override it.

The first parameter tells how many times we want to retry. The second parameter tells the interval between retries in milliseconds.

```ts
this.api.client().retry(3, 1000);
```

### **.retryOnHttpStatusCodes(...codes)**

Enables retry strategy for this request only, manually passing the HTTP status codes that it should retry in case of failure.

```ts
this.api.client().retryOnHttpStatusCodes(500, 501, 502, 503);
```

### **.retryWhen(status_code => {})**

Similar to `.retryOnHttpStatusCodes`, but with `.retryWhen` you can pass a function which receives the status code and determine if we need to retry or not.

```ts
this.api.client().retryWhen(statusCode => statusCode >= 500 || statusCode !== 401);
```

### **.get()**

Sets HTTP GET to the request.

### **.post()**

Sets HTTP POST to the request.

### **.put()**

Sets HTTP PUT to the request.

### **.patch()**

Sets HTTP PATCH to the request.

### **.delete()**

Sets HTTP DELETE to the request.

### **.getResponse()**

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

### **.create()**

Retrieves a new instance of `HttpClientInterceptors`.

### **.useRequestInterceptor((http_client) => {})**

This interceptor is called right before firing the request. This is your last opportunity to change something in your request. It receives the current `HttpClient` as a parameter.

```ts
HttpClientInterceptors.create().useRequestInterceptor((client: HttpClient) => {
  client.header('role', 'read_only');
});
```

### **.useResponseInterceptor((response_body, original_client_response) => {})**

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
HttpClientInterceptors.create().useResponseInterceptor<ApiResponse<any>>(response => response.return);
```

### **.useErrorInterceptor((error) => {})**

This method receives as a parameter the full error from your chosen client. Since we use **axios**, by default an instance of **AxiosError** is passed.

**Important:** If you return something from this method, we're also going to consider the error as resolved. It means that we're already catching the error for you. But instead, if you don't return anything from it, we will execute the method and throw the original exception.

For instance, the code below would not throw an Error when the status code is `404`. For the other status codes it would just log the problem and throw the original error.

```ts
HttpClientInterceptors.create().useErrorInterceptor<AxiosError>((error: AxiosError) => {
  Logger.log('Something wrong happened!', error.message);

  if (error.response.status === 404) {
    return { redirect_to: '/Home' };
  }
});
```

## **Full usage example**

```ts
import { HttpClientInterceptors, HttpClientBuilder } from 'httpclient.js';

const interceptors = HttpClientInterceptors.create()
  .useRequestInterceptor(client => client.header('x-role', 'admin'))
  .useResponseInterceptor<ApiResponse<any>>(response => response.return)
  .useErrorInterceptor<AxiosError>(err => Logger.error(err.message));

const builder = HttpClientBuilder.create().useInterceptors(interceptors);

export default builder;
```

# Retry Strategy

When working with APIs, having resilience in your requests is really important. We don't always know when an endpoint is over its limits or down, but we still rely on that information. There are many resilience concepts, and a common one is the **retry strategy**, and you can set up your own retry strategy by using `HttpClientRetryStrategy` class.

#

## 4. `HttpClientRetryStrategy`

### **.create()**

Retrieves a new instance of `HttpClientRetryStrategy` class.

### **.attempt(max_attempts)**

Sets the maximum number of attempts that you want to retry the request before returning an error. **The default value is 3**.

### **.interval(interval_in_ms)**

Sets the interval between your requests in milliseconds.

If you're using exponential rule (enabled by default), the interval will be the result of: **2 ^ current_attempt \* interval**. For instance, let's suppose you set up your retry rule for a max number of 3 attempts with 1000 ms, the wait would be:

- (2 ^ 1) \* 1000 = 2000 ms = 2 seconds
- (2 ^ 2) \* 1000 = 4000 ms = 4 seconds
- (2 ^ 3) \* 1000 = 8000 ms = 8 seconds

In case of a non-exponential rule, the interval will be equally respected between all attempts.

### **.forHttpStatusCodes(...codes)**

Sets the HTTP status code that you want to consider retrying.

```ts
HttpClientRetryStrategy.create().forHttpStatusCodes(500, 503, 504);
```

### **.shouldRetryWhen((status_code) => {})**

Similar to `.forHttpStatusCodes()`, but instead of passing all the status codes manually, you provide a validation function that returns a boolean. In case of `true`, it will retry.

```ts
HttpClientRetryStrategy.create().shouldRetryWhen(statusCode => statusCode >= 500 || statusCode === 404);
```

### **.useExponentialStrategy(true|false)**

Indicates if it should use the exponential rule for the next attempts. **Default: true**.

```ts
HttpClientRetryStrategy.create().useExponentialStrategy(false);
```

# Try out yourself

This library makes possible the separation between configuration and requests, but each case is a different case and only you know the best way to use it within your scenario.

However, the code below is a full example of how you can use this library.

## config/api.js

```ts
import { HttpClientBuilder, HttpClientInterceptors, HttpClientRetryStrategy } from 'httpclient.js';

// Setting up interceptors
const interceptors = HttpClientInterceptors.create()
  .useResponseInterceptor<ApiResponse<any>>((response: ApiWrapper<any>) => response.return)
  .useErrorInterceptor(err => console.log(err.message));

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

Special thanks to **@wesleyegberto** who created a version of this library for .NET Core.

Github: https://github.com/wesleyegberto

Library: https://github.com/wesleyegberto/csharp-rest-client

## Cheers!
