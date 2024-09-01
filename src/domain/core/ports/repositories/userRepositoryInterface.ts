import { User } from '../../models/user';

export interface userRepositoryInterface {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User>;
  findByUsername(username: string): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
