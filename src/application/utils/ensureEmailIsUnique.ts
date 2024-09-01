import { UserRepository } from '../../domain/core/repositories/userRepository';
import { BadRequestException } from '../exceptions/BadRequestException';

export class EmailValidator {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async ensureEmailIsUnique(newEmail: string | undefined, currentEmail: string = ''): Promise<void> {
    if (newEmail && newEmail !== currentEmail) {
      const emailInUse = await this.userRepository.findByEmail(newEmail);
      if (emailInUse) {
        throw new BadRequestException('Email is already in use.');
      }
    }
  }
}
