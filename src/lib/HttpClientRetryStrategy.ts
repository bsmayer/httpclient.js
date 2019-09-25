export default class HttpClientRetryStrategy {
  private attempts: number;
  private msInterval: number;
  private exponentialRetry: boolean;
  private statusCodes: number[];

  constructor () {
    this.attempts = 3
    this.msInterval = 1000
    this.exponentialRetry = true
    this.statusCodes = []
  }

  public static create (): HttpClientRetryStrategy {
    return new HttpClientRetryStrategy()
  }

  public attempt (attempts: number): HttpClientRetryStrategy {
    this.attempts = attempts
    return this
  }

  public interval (interval: number): HttpClientRetryStrategy {
    this.msInterval = interval
    return this
  }

  public forHttpStatusCodes (...codes: number[]): HttpClientRetryStrategy {
    this.statusCodes = codes
    return this
  }

  public useExponentialStrategy (isExponential = true): HttpClientRetryStrategy {
    this.exponentialRetry = isExponential
    return this
  }

  public getAttempts (): number {
    return this.attempts
  }

  public getInterval (): number {
    return this.msInterval
  }

  public getStatusCodes (): number[] {
    return this.statusCodes
  }

  public isExponential (): boolean {
    return this.exponentialRetry
  }
}
