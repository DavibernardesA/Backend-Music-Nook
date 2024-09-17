import { Router, Request, Response } from 'express';
import { Login } from '../../application/auth/login';
import { UserRepository } from '../../domain/core/repositories/userRepository';
import { env } from '../../application/config/env/env';
import { transformData } from '../validation/transformData';
import { loginSchema } from '../validation/auth/loginSchema';
import { BadRequestException } from '../../application/exceptions/BadRequestException';
import { ForgotPassword } from '../../application/auth/forgotPassword';
import { EmailService } from '../../application/utils/emailService';
import { TemplateCompiler } from '../../application/public/templates/utils/templateCompiler';
import { Authenticate } from '../middlewares/authenticate';
import { ResetPassword } from '../../application/auth/resetPassword';
import passwordResetLimiter from '../../application/config/request/password-request-limiter';

class authResource {
  public router: Router;
  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post('/login', this.login.bind(this));
    this.router.post('/forgot', passwordResetLimiter, this.forgotPassword.bind(this));
    this.router.post('/reset', passwordResetLimiter, this.resetPassword.bind(this));

    // Login middleware for next routes
    this.router.use(new Authenticate().authenticate.bind(new Authenticate()));

    this.router.post('/logout', this.logout.bind(this));
  }

  private async login(req: Request, res: Response) {
    const { email, password } = req.body;

    transformData(loginSchema, { email, password });

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

  private async logout(_: Request, res: Response) {
    return res.clearCookie('authToken');
  }

  private async forgotPassword(req: Request, res: Response) {
    const ip = req.ip;

    if (!ip) throw new BadRequestException('IP address is missing.');

    const cookies = await new ForgotPassword(new UserRepository(), new EmailService(), new TemplateCompiler()).handler(req.body.email, ip);

    res.cookie('passwordResetToken', cookies[0], {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      maxAge: 5 * 60 * 1000 // 5 min
    });

    res.cookie('passwordResetIp', cookies[1], {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      maxAge: 5 * 60 * 1000 // 5 min
    });

    res.cookie('emailRequestReset', cookies[2], {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      maxAge: 5 * 60 * 1000 // 5 min
    });

    return res.status(200).json({ message: 'Password reset email sent.' });
  }

  private async resetPassword(req: Request, res: Response) {
    const ip = req.ip;
    const encryptedIp = req.cookies.passwordResetIp;
    const encryptedToken = req.cookies.passwordResetToken;
    const emailRequestReset = req.cookies.emailRequestReset;
    const { resetToken, password, email } = req.body;

    if (!ip) {
      throw new BadRequestException('IP address is missing.');
    }

    const updatedPassword = await new ResetPassword(new UserRepository()).handler(
      ip,
      encryptedIp,
      resetToken,
      encryptedToken,
      password,
      email,
      emailRequestReset
    );

    if (!updatedPassword) {
      throw new BadRequestException('Invalid request: check the provided data and cookies.');
    }

    return res.status(200).json({ message: 'Password has been reset successfully.' });
  }
}

export default new authResource().router;
