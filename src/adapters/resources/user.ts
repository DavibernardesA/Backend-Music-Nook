import { Request, Response } from 'express';
import { UserList } from '../../application/users/userList';
import { UserRepository } from '../../domain/core/repositories/userRepository';
import { User } from '../../domain/core/models/user';
import { UserMustBeLoggedInException } from '../../application/exceptions/users/userMustBeLoggedInException';

export class UserResource {
  async getUsers(req: Request, res: Response): Promise<Response<User | User[]>> {
    if (!req.user || !req.user.id) {
      throw new UserMustBeLoggedInException('You need to be logged in.');
    }

    const userId = req.user.id;
    const targetUserId = req.params.id;

    const users = await new UserList(new UserRepository()).handler(userId, targetUserId);

    return res.status(200).json(users);
  }
}
