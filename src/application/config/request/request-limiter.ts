import { RateLimitRequestHandler, rateLimit } from 'express-rate-limit';
import { Request, Response } from 'express';
import logger from '../logs/logger';

class RateLimiter {
  private static createRateLimiter(options: {
    windowMs: number;
    max: number;
    message: string;
    keyGenerator?: (req: Request) => string;
    handler?: (req: Request, res: Response) => void;
    standardHeaders?: boolean;
    legacyHeaders?: boolean;
  }): RateLimitRequestHandler {
    return rateLimit({
      windowMs: options.windowMs,
      max: options.max,
      message: options.message,
      keyGenerator: options.keyGenerator,
      handler: options.handler,
      standardHeaders: options.standardHeaders,
      legacyHeaders: options.legacyHeaders
    });
  }

  public static getLimiter(): RateLimitRequestHandler {
    return this.createRateLimiter({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 200,
      message: 'Request limit exceeded. Please try again later.'
    });
  }

  public static getPasswordResetLimiter(): RateLimitRequestHandler {
    return this.createRateLimiter({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 3,
      message: 'You have exceeded the limit for password reset attempts. Please try again in 5 minutes.',
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req: Request): string => req.ip ?? '127.0.0.1',
      handler: (req: Request, res: Response) => {
        logger.warn(`User with ip: ${req.ip ?? '127.0.0.1'} exceeded the request limit on the route: [${req.method}] -> ${req.originalUrl}.`);
        res.status(429).json({ error: 'RateLimitExceeded', message: 'You have exceeded the request limit, try again in 5 minutes.' });
      }
    });
  }
}

export default RateLimiter;
