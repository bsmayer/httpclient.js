export default class ErrorSchema {
  public originalError: any;
  public statusCode: number;

  constructor(originalError: Error, statusCode: number) {
    this.originalError = originalError;
    this.statusCode = statusCode;
  }

  public static of(originalError: any, statusCode: number): ErrorSchema {
    return new ErrorSchema(originalError, statusCode);
  }
}
