import { userInformationDTO } from '../../domain/core/models/dtos/userInformation';
import { UserMinimumInformationDTO } from '../../domain/core/models/dtos/userMinimumInformationDTO';
import { User } from '../../domain/core/models/user';
import { UserRepository } from '../../domain/core/repositories/userRepository';
import { getUserInfoForTarget, getAllUsersInfo } from '../utils/getUserInfo';

export class UserList {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async handler(
    userId: string,
    targetUserId?: string
  ): Promise<User | userInformationDTO | UserMinimumInformationDTO | (userInformationDTO | UserMinimumInformationDTO)[]> {
    const user = await this.userRepository.findById(userId);

    if (targetUserId === user.id) {
      return user;
    }

    if (targetUserId) {
      return getUserInfoForTarget(this.userRepository, user, targetUserId);
    }

    return getAllUsersInfo(this.userRepository, user);
  }
}
