import { Request, Response, NextFunction } from 'express';
import { ApiError } from './api-error';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandling = (err: Error & Partial<ApiError>, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode ?? 500;
  const code = err.name || 'internalServerError';
  const message = err.message || 'Internal server error.';
  const errors = err.errors || [{ code, message }];

  res.status(statusCode).json({
    errors: errors.length > 0 ? errors : [{ code, message }]
  });
};
