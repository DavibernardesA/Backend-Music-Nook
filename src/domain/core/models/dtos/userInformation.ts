export class userInformationDTO {
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
  social_links?: {
    twitter?: string;
    instagram?: string;
    spotify?: string;
  };

  constructor(
    id: string,
    username: string,
    bio?: string,
    avatar?: string,
    followers_count?: number,
    following_count?: number,
    music_interests?: { genres: string[]; artists: string[]; albums: string[] },
    social_links?: { twitter?: string; instagram?: string; spotify?: string }
  ) {
    this.id = id;
    this.username = username;
    this.bio = bio;
    this.avatar = avatar;
    this.followers_count = followers_count ?? 0;
    this.following_count = following_count ?? 0;
    this.music_interests = music_interests;
    this.social_links = social_links;
  }
}
