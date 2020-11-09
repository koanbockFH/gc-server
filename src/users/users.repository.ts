import { validate } from 'class-validator';
import { EntityRepository, Like, Repository } from 'typeorm';
import { UserEntity } from './user.entity';

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
      where: [{ firstName: Like(`%${value}%`) }, { lastName: Like(`%${value}%`) }, { code: Like(`%${value}%`) }],
      order: {
        lastName: 'ASC',
      },
      take: take,
      cache: true,
    });
  }
}
