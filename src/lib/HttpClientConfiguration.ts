import axios from 'axios';

import HttpClientInterceptors from './HttpClientInterceptors';
import HttpClientRetryStrategy from './HttpClientRetryStrategy';
import RestClient from './constants/RestClient';

export default class HttpClientConfiguration {
  public interceptors!: HttpClientInterceptors;
  public retry!: HttpClientRetryStrategy;
  public client: any;
  public restClientType: RestClient;

  constructor() {
    this.restClientType = RestClient.AXIOS;
    this.client = axios;
  }

  public setInterceptors(interceptors: HttpClientInterceptors): HttpClientConfiguration {
    this.interceptors = interceptors;
    return this;
  }

  public setRetryStrategy(retry: HttpClientRetryStrategy): HttpClientConfiguration {
    this.retry = retry;
    return this;
  }

  public setRestClient(client: any, restClientType: RestClient): HttpClientConfiguration {
    this.client = client;
    this.restClientType = restClientType;
    return this;
  }

  public isAxios(): boolean {
    return this.restClientType === RestClient.AXIOS;
  }

  public isRequest(): boolean {
    return this.restClientType === RestClient.REQUEST;
  }

  public isGot(): boolean {
    return this.restClientType === RestClient.GOT;
  }

  public isFetch(): boolean {
    return this.restClientType === RestClient.FETCH;
  }
}
