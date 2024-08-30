import { randomUUID } from 'crypto';
import { User } from '../../domain/core/models/user';
import { BcryptService } from '../utils/bcrypt';
import { UserMinimumInformationDTO } from '../../domain/core/models/dtos/userMinimumInformationDTO';
import { userInformationDTO } from '../../domain/core/models/dtos/userInformation';

/**
 * Creates a new user with the specified details.
 * @param username - The username of the new user.
 * @param templateEmail - The email template to create a unique email address for the user.
 * @param fe - List of users who are followers of the new user.
 * @param fi - List of users whom the new user is following.
 * @param is_private - Optional flag to indicate if the user's profile is private.
 * @returns - A Promise that resolves to the created User object.
 */
export const createUser = async (username: string, templateEmail: string, fe: User[], fi: User[], is_private?: boolean): Promise<User> => {
  const user = new User();

  user.id = randomUUID();
  user.username = username;
  user.email = `${templateEmail}@emailcom`;
  user.password = await new BcryptService().encrypt('12345678');
  user.avatar = 'https://profilephoto.com/avatar';
  user.bio = 'bio';
  user.followers_count = fe.length;
  user.following_count = fi.length;
  user.social_links = {
    twitter: 'https://twitter.com/johndoe',
    instagram: 'https://instagram.com/johndoe',
    spotify: 'https://spotify.com/johndoe'
  };
  user.music_interests = { genres: [], artists: [], albums: [] };
  user.is_private = is_private ?? false;
  user.created_at = new Date();
  user.updated_at = new Date();
  user.followers = fe ?? [];
  user.following = fi ?? [];

  return user;
};

/**
 * Creates a UserMinimumInformationDTO from a User.
 * @param user - The user object.
 * @returns - An instance of UserMinimumInformationDTO.
 */
export function createUserMinimumInformationDTO(user: User): UserMinimumInformationDTO {
  return new UserMinimumInformationDTO(
    user.id,
    user.username,
    user.bio,
    user.avatar,
    user.followers_count,
    user.following_count,
    user.music_interests
  );
}

/**
 * Creates a userInformationDTO from a User.
 * @param user - The user object.
 * @returns - An instance of userInformationDTO.
 */
export function createUserInformationDTO(user: User): userInformationDTO {
  return new userInformationDTO(
    user.id,
    user.username,
    user.bio,
    user.avatar,
    user.followers_count,
    user.following_count,
    user.music_interests,
    user.social_links
  );
}
