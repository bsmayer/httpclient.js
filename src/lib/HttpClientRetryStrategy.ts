export default class HttpClientRetryStrategy {
  private attempts: number;
  private msInterval: number;
  private exponentialRetry: boolean;
  private statusCodes: number[];
  private statusCodeValidation!: (statusCode: number) => boolean;

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

  public shouldRetryWhen (statusCodeValidation: (statusCode: number) => boolean): HttpClientRetryStrategy {
    this.statusCodeValidation = statusCodeValidation
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

  public isExponential (): boolean {
    return this.exponentialRetry
  }

  public checkIfShouldRetry (statusCode: number): boolean {
    let shouldRetry = true

    if (this.statusCodes && this.statusCodes.length) {
      shouldRetry = !!this.statusCodes.find(code => statusCode === code)
    } else if (this.statusCodeValidation) {
      shouldRetry = this.statusCodeValidation(statusCode)
    }

    return shouldRetry
  }
}
