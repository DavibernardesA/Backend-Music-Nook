import { UserRepository } from '../../domain/core/repositories/userRepository';
import { getUserInfoForTarget, getAllUsersInfo } from '../utils/getUserInfo';

export class UserList {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async handler(userId: string, targetUserId?: string) {
    const user = await this.userRepository.findById(userId);

    if (targetUserId) {
      return getUserInfoForTarget(this.userRepository, user, targetUserId);
    }

    return getAllUsersInfo(this.userRepository, user);
  }
}
