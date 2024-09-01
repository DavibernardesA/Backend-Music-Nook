import { Request, Response, Router } from 'express';
import { UserList } from '../../application/users/userList';
import { UserRepository } from '../../domain/core/repositories/userRepository';
import { User } from '../../domain/core/models/user';
import { UserMustBeLoggedInException } from '../../application/exceptions/users/UserMustBeLoggedInException';
import { UserCreate } from '../../application/users/userCreate';
import { EmailValidator } from '../../application/utils/ensureEmailIsUnique';
import { BcryptService } from '../../application/utils/bcrypt';
import { UserCreator } from '../../application/utils/userUtils';
import { ImageModerationService } from '../../application/utils/imageModerationService';
import { env } from '../../application/config/env/env';
import multer from '../middlewares/multer';
import { authenticate } from '../middlewares/authenticate';

class UserResource {
  public router: Router;
  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get('/:id?', authenticate, this.getUsers);
    this.router.post('/', multer.single('avatar'), this.createUser);
  }

  async getUsers(req: Request, res: Response): Promise<Response<User | User[]>> {
    if (!req.user || !req.user.id) {
      throw new UserMustBeLoggedInException('You need to be logged in.');
    }

    const users = await new UserList(new UserRepository()).handler(req.user.id, req.params.id);

    return res.status(200).json(users);
  }

  async createUser(req: Request, res: Response) {
    const newUser = await new UserCreate(
      new EmailValidator(),
      new BcryptService(),
      new UserCreator(new UserRepository(), new ImageModerationService(env.BUCKET_NAME))
    ).handler(req.body);

    return res.status(201).json(newUser);
  }
}

export default new UserResource().router;
