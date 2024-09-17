import { UserRepository } from '../../domain/core/repositories/userRepository';
import { UserNotFoundException } from '../exceptions/users/UserNotFoundException';
import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { User } from '../../domain/core/models/user';
import { EmailService } from '../utils/emailService';
import { TemplateCompiler } from '../public/templates/utils/templateCompiler';
import { forgotPasswordSchema } from '../../adapters/validation/auth/forgotPasswordSchema';
import { transformData } from '../../adapters/validation/transformData';

export class ForgotPassword {
  private userRepository: UserRepository;
  constructor(
    userRepository: UserRepository,
    private emailService: EmailService,
    private templateCompiler: TemplateCompiler
  ) {
    this.userRepository = userRepository;
  }

  async handler(email: string, ip: string): Promise<string[]> {
    transformData(forgotPasswordSchema, { email });
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UserNotFoundException('User not found.');
    }

    const resetToken = crypto.randomInt(100000, 999999).toString(); // Random number with 6 digits
    const encryptResetToken = await bcrypt.hash(resetToken, 10);
    const encryptEmail = await bcrypt.hash(user.email, 10);
    const encryptIp = await bcrypt.hash(ip, 10);

    // await this.sendResetPasswordEmail(user, resetToken);
    return [encryptResetToken, encryptIp, encryptEmail];
  }

  async sendResetPasswordEmail(user: User, resetToken: string) {
    // Commented out for debugging purposes
    // const html = await this.templateCompiler.compile('./src/application/public/templates/resetTokenEmail.html', {
    //   username: user.username,
    //   verificationCode: resetToken
    // });

    // this.emailService.sendMail(user, 'Password Reset Request', html);
    console.log(resetToken);
  }
}
