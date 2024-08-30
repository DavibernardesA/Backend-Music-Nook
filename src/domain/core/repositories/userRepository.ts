import { Repository } from 'typeorm';
import { userRepositoryInterface } from '../ports/repositories/userRepositoryInterface';
import { User } from '../models/user';
import { AppDataSource } from '../../infraestructure/data-source';

export class UserRepository implements userRepositoryInterface {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }
  async findAll(): Promise<User[]> {
    const users = await this.repository.find();
    if (!users) {
      throw new Error('User not found.');
    }
    return users;
  }

  async findById(id: string, relations: string[] = []): Promise<User> {
    const user = await this.repository.findOne({ where: { id }, relations });
    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.repository.findOneBy({ username });
    if (!user) {
      throw new Error('User not found.');
    }

    return user;
  }

  async create(user: User): Promise<User> {
    return await this.repository.save(user);
  }
}
