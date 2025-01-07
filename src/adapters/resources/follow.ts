import { Router, Request, Response } from 'express';
import { UserRepository } from '../../domain/core/repositories/userRepository';
import { FollowUser } from '../../application/follows/followUser';

class FollowResource {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post('/follow', this.followUser.bind(this));
  }

  private async followUser(req: Request, res: Response) {
    const { id } = req.user;
    const { targetUserId } = req.body;

    await new FollowUser(new UserRepository()).handler(id, targetUserId);

    return res.json({ message: 'Follow request sent successfully.' });
  }
}

export default new FollowResource().router;
