import { Router, Request, Response } from 'express';
import { Login } from '../../application/auth/login';
import { UserRepository } from '../../domain/core/repositories/userRepository';
import { env } from '../../application/config/env/env';

class authResource {
  public router: Router;
  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post('/login', this.login.bind(this));
  }

  private async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const token = await new Login(new UserRepository()).handler(email, password);

    return res
      .cookie('authToken', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 // 1 hour
      })
      .status(204)
      .json();
  }
}

export default new authResource().router;
