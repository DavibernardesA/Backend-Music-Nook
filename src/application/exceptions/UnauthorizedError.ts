import { ApiError, ErrorDetail } from './api-error';

export class UnauthorizedError extends ApiError {
  constructor(message: string, errors: ErrorDetail[] = []) {
    super(message, 500, errors);
  }
}
