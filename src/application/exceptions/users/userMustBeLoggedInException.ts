import { ApiError, ErrorDetail } from '../api-error';

export class UserMustBeLoggedInException extends ApiError {
  constructor(message: string, errors: ErrorDetail[] = []) {
    super(message, 500, errors);
  }
}
