import { UserRepository } from '../../domain/core/repositories/userRepository';
import { usernameTakenError } from '../exceptions/usernameTakenError';

export class UsernameGenerator {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async generateUniqueUsername(baseName: string): Promise<string> {
    baseName = baseName.trim().replace(/\s+/g, '');
    const maxAttempts = 10000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const username = `@${baseName}_${this.getRandomNumber()}`;
      if (!(await this.userRepository.findByUsername(username))) {
        return username;
      }
    }

    throw new usernameTakenError('All possible usernames for this base name are taken. Please try a different name.');
  }

  private getRandomNumber(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }
}
