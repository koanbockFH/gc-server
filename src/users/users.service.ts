import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from './user.entity';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private userRepo: UserRepository) {}

  /**
   * Fetches the user by his id from the repo
   * @param userId id of requested user
   */
  async getUserById(userId: number): Promise<UserEntity> {
    return await this.userRepo.findOne({ id: userId });
  }

  /**
   * Fetches users by a query from the repo
   * @param query search query
   */
  async getUsersByQuery(query: string): Promise<UserEntity[]> {
    return await this.userRepo.findBySearchArg(query);
  }

  /**
   * Update or save user
   * @param user user object to update
   */
  async saveOrUpdate(user: UserDTO): Promise<void> {
    user.password = bcrypt.hashSync(user.password, 8);
    const newUser = new UserEntity(user);

    await this.userRepo.saveOrUpdate(newUser);
  }
}
