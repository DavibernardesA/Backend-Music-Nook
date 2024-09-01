import { Request, Response, NextFunction } from 'express';
import logger from '../../application/config/logs/logger';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../../application/config/env/env';
import { UserRepository } from '../../domain/core/repositories/userRepository';
import { UnauthorizedError } from '../../application/exceptions/UnauthorizedError';

export class Authenticate {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.authToken;

    if (!token) {
      logger.warn(`User with ip: ${req.ip} tried to request the route: [${req.method}] -> ${req.baseUrl}.`);
      throw new UnauthorizedError('Unauthorized');
    }

    const { id } = jwt.verify(token, env.JWT_PASS) as JwtPayload;
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UnauthorizedError('Unauthorized');
    }

    req.user = user;
    next();
  }
}
