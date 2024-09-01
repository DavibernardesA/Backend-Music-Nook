import { UserRepository } from '../../domain/core/repositories/userRepository';
import { env } from '../config/env/env';
import { BadRequestException } from '../exceptions/BadRequestException';
import { InvalidFormatError } from '../exceptions/users/InvalidFormatError';
import { BcryptService } from '../utils/bcrypt';
import jwt from 'jsonwebtoken';

export class Login {
  private userRepository: UserRepository;
  private bcryptService: BcryptService;

  constructor(useRepository: UserRepository) {
    this.userRepository = useRepository;
    this.bcryptService = new BcryptService();
  }

  async handler(email: string, password: string) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (!existingUser) {
      throw new BadRequestException('Bad request, please check provided data.');
    }

    const passwordCompare = await this.bcryptService.compare(password, existingUser.password);
    if (!passwordCompare) {
      throw new InvalidFormatError('Invalid request, please check the provided data.');
    }

    const token = jwt.sign({ id: existingUser.id }, env.JWT_PASS, { expiresIn: '1h' });

    return token;
  }
}
