import { Request, Response } from 'express';
import { RateLimitRequestHandler, rateLimit } from 'express-rate-limit';

const passwordResetLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 3,
  message: 'You have exceeded the limit for password reset attempts. Please try again in 5 minutes."',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    return req.ip ?? '127.0.0.1';
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({ error: 'RateLimitExceeded', message: 'You have exceeded the request limit, try again in 5 minutes.' });
  }
});

export default passwordResetLimiter;
