import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from './user.entity';
import { RegisterUserDTO } from './dto/register-user.dto';
import { UserDTO } from './dto/user.dto';
import { IPaginationOptions } from 'src/common/pagination/pagination.options';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { IUserFilterOptions } from './util/userFilter.option';

@Injectable()
export class UsersService {
  constructor(private userRepo: UserRepository) {}

  /**
   * Fetches the user by his id from the repo
   * @param userId id of requested user
   */
  async getUserById(userId: number): Promise<UserDTO> {
    return new UserDTO(await this.userRepo.findOne({ id: userId }));
  }

  /**
   * Fetches users by a query from the repo
   * @param query search query
   */
  async getUsersByQuery(query: string): Promise<UserEntity[]> {
    return await this.userRepo.findBySearchArg(query);
  }

  async getUserByCodeOrMail(codeOrMail: string): Promise<UserEntity> {
    let user = await this.userRepo.findOne({ where: { code: codeOrMail } });
    if (codeOrMail.includes('@')) {
      user = await this.userRepo.findOne({ where: { mail: codeOrMail } });
    }
    return user;
  }

  /**
   * Update or save user
   * @param user user object to update
   */
  async saveOrUpdate(user: RegisterUserDTO): Promise<void> {
    const newUser = new UserEntity(user);
    newUser.password = bcrypt.hashSync(user.password, 8);

    await this.userRepo.saveOrUpdate(newUser);
  }

  async getAll(filter: IUserFilterOptions, pagination: IPaginationOptions): Promise<Pagination<UserDTO>> {
    const values = await this.userRepo.paginate(filter, pagination);

    const result = new Pagination(
      values.items.map(e => new UserDTO(e)),
      values.currentPage,
      values.totalPages,
    );

    return result;
  }
}
