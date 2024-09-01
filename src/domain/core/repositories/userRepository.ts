import { Repository } from 'typeorm';
import { userRepositoryInterface } from '../ports/repositories/userRepositoryInterface';
import { User } from '../models/user';
import { AppDataSource } from '../../infraestructure/data-source';
import { UserNotFoundException } from '../../../application/exceptions/users/UserNotFoundException';

export class UserRepository implements userRepositoryInterface {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }
  async findAll(): Promise<User[]> {
    const users = await this.repository.find();
    if (!users) {
      throw new UserNotFoundException('User not found.');
    }
    return users;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { email } });

    return user;
  }

  async findById(id: string, relations: string[] = []): Promise<User> {
    const user = await this.repository.findOne({ where: { id }, relations });
    if (!user) {
      throw new UserNotFoundException('User not found.');
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.repository.findOneBy({ username });
    if (!user) {
      throw new UserNotFoundException('User not found.');
    }

    return user;
  }

  async create(user: User): Promise<User> {
    return await this.repository.save(user);
  }
}
