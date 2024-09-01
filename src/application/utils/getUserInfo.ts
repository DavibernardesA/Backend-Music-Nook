import { userInformationDTO } from '../../domain/core/models/dtos/userInformation';
import { UserRepository } from '../../domain/core/repositories/userRepository';
import { User } from '../../domain/core/models/user';
import { UserMinimumInformationDTO } from '../../domain/core/models/dtos/userMinimumInformationDTO';

/**
 * Gets information for a specific target user based on privacy settings.
 * @param userRepository - The user repository instance.
 * @param currentUser - The currently logged-in user.
 * @param targetUserId - The ID of the target user.
 * @returns - The appropriate user DTO based on privacy settings.
 */
export async function getUserInfoForTarget(
  userRepository: UserRepository,
  currentUser: User,
  targetUserId: string
): Promise<userInformationDTO | UserMinimumInformationDTO> {
  const targetUser = await userRepository.findById(targetUserId);
  const isFollowing = await userRepository.isFollowing(currentUser.id, targetUserId);

  if (targetUser.is_private && !isFollowing) {
    // Return minimal information if the user is private and not followed
    return new UserMinimumInformationDTO(
      targetUser.id,
      targetUser.username,
      targetUser.bio,
      targetUser.avatar,
      targetUser.followers_count,
      targetUser.following_count,
      targetUser.music_interests
    );
  }

  // Return full information if the user is public or followed
  return new userInformationDTO(
    targetUser.id,
    targetUser.username,
    targetUser.bio,
    targetUser.avatar,
    targetUser.followers_count,
    targetUser.following_count,
    targetUser.music_interests,
    targetUser.social_links
  );
}

/**
 * Gets information for all users based on privacy settings.
 * @param userRepository - The user repository instance.
 * @param currentUser - The currently logged-in user.
 * @returns - An array of user DTOs.
 */
export async function getAllUsersInfo(
  userRepository: UserRepository,
  currentUser: User
): Promise<(userInformationDTO | UserMinimumInformationDTO)[]> {
  const users = await userRepository.findAll();

  return await Promise.all(
    users.map(async u => {
      const isFollowing = await userRepository.isFollowing(currentUser.id, u.id);

      if (u.is_private && !isFollowing) {
        return new UserMinimumInformationDTO(u.id, u.username, u.bio, u.avatar, u.followers_count, u.following_count, u.music_interests);
      }

      return new userInformationDTO(u.id, u.username, u.bio, u.avatar, u.followers_count, u.following_count, u.music_interests, u.social_links);
    })
  );
}
