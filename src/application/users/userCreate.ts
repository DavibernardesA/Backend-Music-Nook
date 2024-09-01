import { User } from '../../domain/core/models/user';
import { EmailValidator } from '../utils/ensureEmailIsUnique';
import { BcryptService } from '../utils/bcrypt';
import { UserCreator } from '../utils/userUtils';

export class UserCreate {
  constructor(
    private emailValidator: EmailValidator,
    private bcryptService: BcryptService,
    private userCreator: UserCreator
  ) {}

  public async handler(body: User, file?: Express.Multer.File) {
    await this.emailValidator.ensureEmailIsUnique(body.email);
    const encryptedPassword = await this.bcryptService.encrypt(body.password);

    return await this.userCreator.createUser(body, encryptedPassword, file);
  }
}
