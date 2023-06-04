import { AxiosStatic } from 'axios';
import { RequestAPI, Request, CoreOptions, RequiredUriUrl } from 'request';
import { GotInstance } from 'got';

import HttpClient from './HttpClient';
import HttpClientInterceptors from './HttpClientInterceptors';
import HttpClientRetryStrategy from './HttpClientRetryStrategy';
import HttpClientConfiguration from './HttpClientConfiguration';
import RestClient from './constants/RestClient';

export default class HttpClientBuilder {
  private baseUrl: string;
  private configuration: HttpClientConfiguration;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.configuration = new HttpClientConfiguration();
  }

  public static create(baseUrl: string): HttpClientBuilder {
    if (!baseUrl) throw new Error('You must provide a base url');

    return new HttpClientBuilder(baseUrl);
  }

  public useAxios(axios: AxiosStatic): HttpClientBuilder {
    this.configuration.setRestClient(axios, RestClient.AXIOS);
    return this;
  }

  public useRequest(request: RequestAPI<Request, CoreOptions, RequiredUriUrl>): HttpClientBuilder {
    this.configuration.setRestClient(request, RestClient.REQUEST);
    return this;
  }

  public useGot(got: GotInstance): HttpClientBuilder {
    this.configuration.setRestClient(got, RestClient.GOT);
    return this;
  }

  public useFetch(): HttpClientBuilder {
    this.configuration.setRestClient(null, RestClient.FETCH);
    return this;
  }

  public useInterceptors(interceptors: HttpClientInterceptors): HttpClientBuilder {
    this.configuration.setInterceptors(interceptors);
    return this;
  }

  public useRetryStrategy(retry: HttpClientRetryStrategy): HttpClientBuilder {
    this.configuration.setRetryStrategy(retry);
    return this;
  }

  public use(config: HttpClientInterceptors | HttpClientRetryStrategy): HttpClientBuilder {
    if (config instanceof HttpClientInterceptors) {
      this.configuration.setInterceptors(config);
    } else if (config instanceof HttpClientRetryStrategy) {
      this.configuration.setRetryStrategy(config);
    }
    return this;
  }

  public client(): HttpClient {
    return new HttpClient(this.baseUrl, this.configuration);
  }
}
