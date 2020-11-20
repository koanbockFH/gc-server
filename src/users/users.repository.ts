import { validate } from 'class-validator';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { IPaginationOptions } from 'src/common/pagination/pagination.options';
import { EntityRepository, FindConditions, FindManyOptions, Like, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { IUserFilterOptions } from './util/userFilter.option';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  /**
   * Inserts a user if it does not provide a valid id, and updates it if it does
   * @param user user to be saved or updated
   * @throws if a id is provided but no user exists
   */
  async saveOrUpdate(user: UserEntity): Promise<void> {
    const errors = await validate(user);
    if (errors.length > 0) {
      throw errors;
    }

    await this.save(user);
  }

  /**
   * Returns a user if the code or mail matches and password combination matches a user in the database
   * @param codeOrMail code or the mail address of user
   * @param password password hash of the user
   * @returns user found
   * @throws if no user can be found
   */
  findByCredentials(codeOrMail: string, password: string): Promise<UserEntity> {
    if (codeOrMail.includes('@')) {
      return this.findOneOrFail({ mail: codeOrMail, password });
    }

    return this.findOneOrFail({ code: codeOrMail, password });
  }

  /**
   * Searches a User based on the searchParameter
   * @param value firstName, lastName, code
   * @returns A list of Users that match the search pattern
   */
  findBySearchArg(value: string, take = 10): Promise<UserEntity[]> {
    return this.find({
      where: [
        { firstName: Like(`%${value}%`) },
        { lastName: Like(`%${value}%`) },
        { code: Like(`%${value}%`) },
        { mail: Like(`%${value}%`) },
      ],
      order: {
        lastName: 'ASC',
      },
      take: take,
      cache: true,
    });
  }

  async paginate(filter: IUserFilterOptions, options: IPaginationOptions): Promise<Pagination<UserEntity>> {
    const query: FindManyOptions<UserEntity> = {
      order: {
        firstName: 'ASC',
      },
    };

    query.where = this._getQuery(filter);
    const count = await this.count(query);
    const total = Math.round(count / (options.take ?? count));
    query.take = options.take;
    query.skip = options.take && options.page ? (options.page - 1) * options.take : null;
    const values = await this.find(query);

    return new Pagination(values, options.page, total);
  }

  _getQuery(filter: IUserFilterOptions): FindConditions<UserEntity>[] {
    const where: FindConditions<UserEntity> = {};
    if (filter.userType !== undefined) {
      where.userType = filter.userType;
    }
    let clauses: FindConditions<UserEntity>[] = [];
    if (filter.searchArg) {
      const or: FindConditions<UserEntity>[] = [
        { ...where, firstName: Like(`%${filter.searchArg}%`) },
        { ...where, lastName: Like(`%${filter.searchArg}%`) },
        { ...where, code: Like(`%${filter.searchArg}%`) },
        { ...where, mail: Like(`%${filter.searchArg}%`) },
      ];
      clauses = or;
    } else {
      clauses.push(where);
    }

    return clauses;
  }
}
