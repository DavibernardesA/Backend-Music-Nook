import { resetPasswordSchema } from '../../adapters/validation/auth/resetPasswordSchema';
import { transformData } from '../../adapters/validation/transformData';
import bcrypt from 'bcrypt';
import { UserRepository } from '../../domain/core/repositories/userRepository';
import { UserNotFoundException } from '../exceptions/users/UserNotFoundException';
import { BadRequestException } from '../exceptions/BadRequestException';

export class ResetPassword {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async handler(
    ip: string,
    encryptedIp: string,
    resetToken: string,
    encryptedToken: string,
    newPassword: string,
    email: string,
    emailRequestReset: string
  ): Promise<boolean> {
    transformData(resetPasswordSchema, { ip, encryptedIp, resetToken, encryptedToken, newPassword, email, emailRequestReset });
    const validIP = await bcrypt.compare(ip, encryptedIp);
    const validToken = await bcrypt.compare(resetToken, encryptedToken);
    const existingUser = await this.userRepository.findByEmail(email);
    const validEmail = await bcrypt.compare(email, emailRequestReset);

    if (!existingUser) {
      throw new UserNotFoundException('User not found.');
    }

    if (!validIP || !validToken || !validEmail) {
      throw new BadRequestException('Invalid request: check the provided data.');
    }

    // Checks if the new password is the same as the old password
    const isNewPasswordSameAsOld = await bcrypt.compare(newPassword, existingUser.password);

    if (isNewPasswordSameAsOld) {
      throw new BadRequestException('The new password cannot be the same as the previous one.');
    }

    const encryptPassword = await bcrypt.hash(newPassword, 10);
    existingUser.password = encryptPassword;
    await this.userRepository.create(existingUser);

    return true;
  }
}
