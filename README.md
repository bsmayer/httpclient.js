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

Friendly wrapper to use with your favorite rest client in your Javascript projects. Through intuitive builders, you can make your requests looking much more readable, isolating your configuration and creating robust api calls without having to concern about the library you're using. 

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

### ___.authorization(type, value)__

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

### __.retryWhen(status_code => {})

Similar to `.retryOnHttpStatusCodes`, but with `.retryWhen` you can pass a function which receives the status code and determine if we need to retry or not. 

```ts
this.api.client()
  .retryWhen(statusCode => statusCode >= 500 || statusCode !== 401)
```

### __.get()__

Fires a HTTP GET

### __.post()__

Fires a HTTP POST

### __.put()__

Fires a HTTP PUT

### __.patch()__

Fires a HTTP PATCH

### __.delete()__

Fires a HTTP DELETE

### __.getResponse()__



## Usage

This library supports pure NodeJS and Typescript. 

Below is a simple example using NodeJS modules.

```javascript
const { HttpClientBuilder } = require('httpclient.js');

const builder = HttpClientBuilder.create(process.env.BASE_URL);

async function fetch(userId) {
  return await builder
    .client()
    .path('path1', 'path2', 'path3')
    .query('sortby', 'name')
    .header('foo', 'bar')
    .get()
    .getResponse();
}
```

And here's a simple example using Typescript.

```typescript
import { HttpClientBuilder } from 'httpclient.js';

export default class YourService {
  constructor() {
    this.builder = HttpClientBuilder.create(process.env.BASE_URL);
  }

  public async fetch(userId: string): Promise<User> {
    return await this.builder
      .client()
      .path('users', userId)
      .get()
      .getResponse<User>();
  }
}
```

We strongly recommend the use of this library with Typescript, using generics to make your calls even more readable. 

## HttpClient builders

When using the method __.client()__ from __HttpClientBuilder__, you're retrieving a new instance of your HttpClient. From now on, building your query should be really simple, using the following builders:

| Builder | Description |
| ------- | ----------- |
| .path(...args) | Those are the paths that will make up your base URL. Each path you put here will be translated to __/path1/path2/path3__|
| .header(name, value) | Will send a header with the provided name to the endpoint|
| .query(name, value) | Will add a querystring to the URL. Each query will be translated to __?name=value__|
| .payload(obj) | Will send the provided object to the endpoint|
| .authorization(type, value) | Will create an Authorization header with provided type and value |
| .basicAuthorization(user, password) | Will create a Basic Authorization header, converting the string __user:password__ to Base64 |
| .bearerAuthorization(token) | Will create a Bearer Authorization header with provided token |
| .retry(attempt, interval) | Will enable Retry Strategy to this request only in case it wasn't enabled on HttpClientBuilder and also override the retry strategy of the builder, setting the number of attempts you want to retry and the inverval between them. You can check more about retry strategies below. Similar to HttpClientRetryStrategy.attempt().interval() |
| .retryOnHttpStatusCodes(...codes) | Will enable Retry Strategy to this request only, setting the HTTP Status Codes that need to considered to fire the Retry Strategy. Similar to HttpClientRetryStrategy.forHttpStatusCodes() |
| .retryWhen((statusCode) => {}) | Will enable Retry Strategy to this request only, setting a retry validation function that will be used to check whether we need to retry or not. Similar to HttpClientRetryStrategy.shouldRetryWhen() |
| .get() | Use HTTP GET |
| .post() | Use HTTP POST |
| .put() | Use HTTP PUT |
| .delete() | Use HTTP DELETE |
| .patch() | Use HTTP PATCH |
| .getResponse\<YourType>() | Fires your HTTP request and already converts the result to the provided type. Will return __any__ or a simple object if type was not provided|

# Interceptors

Interceptors allows you to inject data in your request, or handle your response and error before returning to your method. This is useful when you have a default api response wrapper, or when you want to grab a specific error code. 

Creating an interceptor is as simple as creating a new client. By just using the **HttpClientInterceptors** builder, you can create and configure your interceptors in a very intuitive way. 

Right now, you can inject the following interceptors: __useRequestInterceptor__, __useResponseInterceptor__ and __useErrorInterceptor__.

Below is how you can create and configure your own global interceptors. 

```typescript
import { AxiosError } from 'axios';

import { 
  HttpClientInterceptors, 
  HttpClientBuilder, 
  HttpClient 
} from 'httpclient.js';

const interceptors = HttpClientInterceptors.create()
  .useRequestInterceptor((client: HttpClient) => {})
  .useResponseInterceptor<YourWrapper>((response: YourWrapper) => {})
  .useErrorInterceptor((err: AxiosError) => {});

const builder = HttpClientBuilder
  .create(process.env.BASE_URL)
  .useInterceptors(interceptors);

export default builder;
```

```typescript
import builder from './default-builder';

export default class YourService {
  public async create(user: User): Promise<User> {
    return await builder
      .client()
      .path('users')
      .payload(user)
      .post()
      .getResponse<User>();
  }
}
```

# Retry Strategy

This library is prepared to handle HTTP failures and automatically retry according to your rules. Setting up a Retry Strategy is easy, and you just need the help of __HttpClientRetryStrategy__ class. See the example below:

```typescript
import { HttpClientBuilder, HttpClientRetryStrategy } from 'httpclient.js';

const retry = HttpClientRetryStrategy.create()
  .attempt(3) // how many attempts that we will retry before throwing an error
  .interval(1000); // interval between them

const builder = HttpClientBuilder.create(process.env.BASE_URL)
  .useRetryStrategy(retry);

export default builder;
```
The above code is creating a retry strategy for all errors in your application. It will try to fire your request for 3 times, using an interval of 1000 ms. By default, the interval uses an exponential rule - interval ^ current attempt - but you can disable that with the use of __.useExponentialStrategy(false)__. 

Also, you're able to determine what are the status codes that you want to retry. Check the example below:

```typescript
const retry = HttpClientRetryStrategy.create()
  .forHttpStatusCodes(404, 500)
  .attempt(3)
  .interval(2000)
  .useExponentialStrategy(false);
```

And if you're not sure about what status codes you need to validate, you can use the builder __.shouldRetryWhen(statusCode => {})__. 

```typescript
const retry = HttpClientRetryStrategy.create()
  .shouldRetryWhen((statusCode: number) => statusCode >= 500 || statusCode === 404)
  .attempt(3)
  .interval(1000);
```

As you can see, setting up resiliant rules is pretty simple

# Real world examples

We are preparing an examples folder with real world scenarios, but while it's not done, you can follow the code below to understand how easy and clean your requests can be.

> config/api.ts
```typescript
import { 
  HttpClientBuilder, 
  HttpClientInterceptors, 
  HttpClientRetryStrategy 
} from 'httpclient.js'

// Setting up interceptors
const interceptors = HttpClientInterceptors.create()
  .useResponseInterceptor<ApiWrapper<any>>((response: ApiWrapper<any>) => response.return);

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

> services/users.ts
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

If you like this library and idea, you can help us implementing new features and finding bugs. Feel free to send a PR and open issues releated to your problem. 

Special thanks to **@wesleyegberto** who created a version of this library for .NET Core.

Github: https://github.com/wesleyegberto

Library: https://github.com/wesleyegberto/csharp-rest-client

## Cheers!




