# HTTPCLIENT.JS

[![npm version](https://badge.fury.io/js/httpclient.js.svg)](https://badge.fury.io/js/httpclient.js)

Rest made simple, intuitive and robust. This is a rest client for Javascript projects. 

## Instalation

```bash
yarn add httpclient.js
```

or

```bash
npm install httpclient.js --save
```

## Usage

This library supports pure NodeJS and Typescript. 

Below is an example using NodeJS modules.

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

# Interceptors

This library allows you to create interceptors, so that you can inject data on your request, or handle your response and error before returning to your method. This is useful when you have a default api response wrapper, or when you want to grab an specific error code. 

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




