export class UserMinimumInformationDTO {
  id: string;
  username: string;
  bio?: string;
  avatar?: string;
  followers_count: number;
  following_count: number;
  music_interests?: {
    genres: string[];
    artists: string[];
    albums: string[];
  };

  constructor(
    id: string,
    username: string,
    bio: string | undefined,
    avatar: string | undefined,
    followers_count: number,
    following_count: number,
    music_interests: { genres: string[]; artists: string[]; albums: string[] } | undefined
  ) {
    this.id = id;
    this.username = username;
    this.bio = bio;
    this.avatar = avatar;
    this.followers_count = followers_count;
    this.following_count = following_count;
    this.music_interests = music_interests;
  }
}
