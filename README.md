# HTTPCLIENT.JS

[![npm version](https://badge.fury.io/js/httpclient.js.svg)](https://badge.fury.io/js/httpclient.js)

Rest made simple, intuitive and robust. This is a rest client for Javascript projects. 

# Why another rest client?

There are a lot of famous rest clients out there: axios, request, got, super agent... Why another rest client? 

Although those are really good libraries (we love and use axios here), they are a bit repetitive and if you're making a huge request with a lot of paths and parameters, it tends to be a bit harder to read. 

When working on bigger projects, specially using Typescript, sometimes you need something simple and more readable. Nothing like a good builder for making things flow better. 

> So you're telling me this library is just a wrapper on axios?

Yes, this library is just an wrapper on axios. It offers you a different and friendly sintax for writing your http requests, using axios behind the scenes. You're able to isolate your configuration from your requests, making things a lot cleaner. 

# Roadmap

- Support for all HTTP methods (right now we're supporting GET, POST, PUT, PATCH and DELETE).
- Resilience fallback.

# How to use

## Instalation

```bash
yarn add httpclient.js
```

Or

```bash
npm install httpclient.js --save
```

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




