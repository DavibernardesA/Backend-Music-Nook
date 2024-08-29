export interface ErrorDetail {
  code: string;
  message: string;
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: ErrorDetail[];

  constructor(message: string, statusCode: number, errors: ErrorDetail[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    this.errors = errors.length > 0 ? errors : [{ code: this.name, message }];
  }
}
