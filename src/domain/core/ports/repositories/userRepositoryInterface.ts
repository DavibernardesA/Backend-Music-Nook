import { User } from '../../models/user';

export interface userRepositoryInterface {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User>;
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  isFollowing(currentUserId: string, targetUserId: string): Promise<boolean>;
}
