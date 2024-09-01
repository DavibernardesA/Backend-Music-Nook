import { Request, Response, NextFunction } from 'express';
import logger from '../../application/config/logs/logger';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../../application/config/env/env';
import { UserRepository } from '../../domain/core/repositories/userRepository';
import { UnauthorizedError } from '../../application/exceptions/UnauthorizedError';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.authToken;
  if (!token) {
    logger.warn(`User with ip: ${req.ip} tried to request the route: [${req.method}] -> ${req.baseUrl}.`);
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { id } = jwt.verify(token, env.JWT_PASS) as JwtPayload;
    const user = await new UserRepository().findById(id);
    if (!user) throw new UnauthorizedError('Unauthorized.');
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error });
  }
};
