import HttpClient from './HttpClient';

export default class HttpClientInterceptors {
  private requestInterceptor!: (client: HttpClient) => any;
  private responseInterceptor!: (responseBody: any, originalClientResponse: any) => any;
  private errorInterceptor!: (error: any) => any;

  public static create(): HttpClientInterceptors {
    return new HttpClientInterceptors();
  }

  public useRequestInterceptor(fn: (client: HttpClient) => any): HttpClientInterceptors {
    this.requestInterceptor = fn;
    return this;
  }

  public useResponseInterceptor<T>(fn: (response: T) => any): HttpClientInterceptors {
    this.responseInterceptor = fn;
    return this;
  }

  public useErrorInterceptor(fn: (error: any) => any): HttpClientInterceptors {
    this.errorInterceptor = fn;
    return this;
  }

  public applyRequestInterceptor(client: HttpClient): any {
    if (this.requestInterceptor) {
      return this.requestInterceptor(client);
    }
  }

  public applyResponseInterceptor<T>(responseBody: T, originalClientResponse: any): any {
    if (this.hasResponseInterceptor()) {
      return this.responseInterceptor(responseBody, originalClientResponse);
    }
  }

  public applyErrorInterceptor(error: any): any {
    if (this.errorInterceptor) {
      return this.errorInterceptor(error);
    }
  }

  public hasResponseInterceptor(): boolean {
    return !!this.responseInterceptor;
  }
}
