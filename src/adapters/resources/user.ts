import { Request, Response, Router } from 'express';
import { UserList } from '../../application/users/userList';
import { UserRepository } from '../../domain/core/repositories/userRepository';
import { User } from '../../domain/core/models/user';
import { UserCreate } from '../../application/users/userCreate';
import { EmailValidator } from '../../application/utils/ensureEmailIsUnique';
import { BcryptService } from '../../application/utils/bcrypt';
import { UserCreator } from '../../application/utils/userUtils';
import { ImageModerationService } from '../../application/utils/imageModerationService';
import { env } from '../../application/config/env/env';
import multer from '../middlewares/multer';
import { Authenticate } from '../middlewares/authenticate';
import { transformData } from '../validation/transformData';
import { userListSchema } from '../validation/user/userListSchema';
import { userCreateSchema } from '../validation/user/userFormSchema';

class UserResource {
  public router: Router;
  private authenticate: Authenticate;
  constructor() {
    this.router = Router();
    this.authenticate = new Authenticate();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get('/:id?', this.authenticate.authenticate.bind(this.authenticate), this.getUsers);
    this.router.post('/', multer.single('avatar'), this.userCreate);
  }

  async getUsers(req: Request, res: Response): Promise<Response<User | User[]>> {
    const userId = req.user.id;
    const targetUserId = req.params.id;

    transformData(userListSchema, { userId, targetUserId });

    const users = await new UserList(new UserRepository()).handler(userId, targetUserId);

    return res.status(200).json(users);
  }

  async userCreate(req: Request, res: Response) {
    const userData = req.body;
    transformData(userCreateSchema, userData);
    const newUser = await new UserCreate(
      new EmailValidator(),
      new BcryptService(),
      new UserCreator(new UserRepository(), new ImageModerationService(env.BUCKET_NAME))
    ).handler(req.body);

    return res.status(201).json(newUser);
  }
}

export default new UserResource().router;
