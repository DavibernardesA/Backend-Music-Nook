import { followUserSchema } from '../../adapters/validation/follow/followUserSchema';
import { transformData } from '../../adapters/validation/transformData';
import { UserRepository } from '../../domain/core/repositories/userRepository';
import { BadRequestException } from '../exceptions/BadRequestException';
import { UserNotFoundException } from '../exceptions/users/UserNotFoundException';

export class FollowUser {
  constructor(private userRepository: UserRepository) {}

  async handler(userId: string, targetUserId: string): Promise<void> {
    const user = await this.userRepository.findById(userId, ['following']);
    const targetUser = await this.userRepository.findById(targetUserId, ['followers']);

    transformData(followUserSchema, { userId, targetUserId });

    if (!user || !targetUser) {
      throw new UserNotFoundException('User not found.');
    }

    if (userId === targetUserId) {
      throw new BadRequestException('Cannot follow yourself.');
    }

    if (user.following.find(u => u.id === targetUserId)) {
      throw new BadRequestException('Already following this user.');
    }

    if (targetUser.is_private) {
      await this.addFollowRequest(userId, targetUserId);
    } else {
      user.following.push(targetUser);
      targetUser.followers.push(user);

      user.following_count += 1;
      targetUser.followers_count += 1;

      await this.userRepository.create(user);
      await this.userRepository.create(targetUser);
    }
  }

  private async addFollowRequest(userId: string, targetUserId: string): Promise<void> {
    const user = await this.userRepository.findById(userId, ['followRequests']);
    const targetUser = await this.userRepository.findById(targetUserId, ['followRequests']);

    if (!user || !targetUser) {
      throw new UserNotFoundException('User not found.');
    }

    if (user.followRequests.find(u => u.id === targetUser.id)) {
      throw new BadRequestException('Follow request already sent.');
    }

    user.followRequests.push(targetUser);
    await this.userRepository.create(user);
  }
}
