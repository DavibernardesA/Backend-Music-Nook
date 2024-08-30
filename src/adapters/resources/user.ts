import { Request, Response, Router } from 'express';
import { UserList } from '../../application/users/userList';
import { UserRepository } from '../../domain/core/repositories/userRepository';
import { User } from '../../domain/core/models/user';
import { UserMustBeLoggedInException } from '../../application/exceptions/users/userMustBeLoggedInException';

class UserResource {
  public router: Router;
  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get('/:id?', this.getUsers);
  }

  async getUsers(req: Request, res: Response): Promise<Response<User | User[]>> {
    if (!req.user || !req.user.id) {
      throw new UserMustBeLoggedInException('You need to be logged in.');
    }

    const users = await new UserList(new UserRepository()).handler(req.user.id, req.params.id);

    return res.status(200).json(users);
  }
}

export default new UserResource().router;
