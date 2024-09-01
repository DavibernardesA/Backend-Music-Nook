import { randomUUID } from 'crypto';
import { User } from '../../domain/core/models/user';
import { UserRepository } from '../../domain/core/repositories/userRepository';
import { userInformationDTO } from '../../domain/core/models/dtos/userInformation';
import { usernameTakenError } from '../exceptions/users/usernameTakenError';
import { ImageModerationService } from './imageModerationService';

interface NormalizeMusicInterestsDTO {
  genres: string[];
  artists: string[];
  albums: string[];
}

export class UserCreator {
  private imageModerationService: ImageModerationService;

  constructor(
    private userRepository: UserRepository,
    imageModerationService: ImageModerationService
  ) {
    this.imageModerationService = imageModerationService;
  }

  public async createUser(body: User, encryptedPassword: string, file?: Express.Multer.File): Promise<userInformationDTO> {
    const username = await this.generateUniqueUsername(body.username);
    const avatarUrl = file ? await this.imageModerationService.handleFileUpload(file, username) : undefined;

    const newUser = this.buildUserEntity(body, username, encryptedPassword, avatarUrl);
    return this.buildUserInformationDTO(newUser);
  }

  private async generateUniqueUsername(baseName: string): Promise<string> {
    baseName = baseName.trim().replace(/\s+/g, '');
    const maxAttempts = 10000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const username = `@${baseName}_${this.getRandomNumber()}`;
      if (!(await this.userRepository.findByUsername(username))) {
        return username;
      }
    }

    throw new usernameTakenError('All possible usernames for this base name are taken. Please try a different name.');
  }

  private getRandomNumber(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }

  private normalizeMusicInterests(musicInterests: NormalizeMusicInterestsDTO | undefined): NormalizeMusicInterestsDTO {
    return {
      genres: musicInterests?.genres || [],
      artists: musicInterests?.artists || [],
      albums: musicInterests?.albums || []
    };
  }

  private buildUserEntity(body: User, username: string, encryptedPassword: string, avatarUrl?: string): User {
    return {
      id: randomUUID(),
      username,
      email: body.email,
      bio: body.bio || '',
      avatar: avatarUrl,
      password: encryptedPassword,
      social_links: body.social_links || { twitter: '', instagram: '', spotify: '' },
      music_interests: this.normalizeMusicInterests(body.music_interests),
      is_private: body.is_private ?? false,
      followers_count: 0,
      following_count: 0,
      followers: [],
      following: [],
      followRequests: [],
      sentFollowRequests: [],
      created_at: new Date(),
      updated_at: new Date()
    };
  }

  private buildUserInformationDTO(user: User): userInformationDTO {
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
}
