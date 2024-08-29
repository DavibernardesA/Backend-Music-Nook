import { User } from '../domain/core/models/user';

declare global {
  namespace Express {
    export interface Request {
      user: Partial<User>;
    }
  }
}
