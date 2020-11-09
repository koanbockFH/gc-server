import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { UserEntity } from 'src/users/user.entity';
import { UserRepository } from 'src/users/users.repository';
import { createConnection, getConnection, getCustomRepository } from 'typeorm';
import { UserEnum } from './enum/user.enum';

describe('UserRepository', () => {
  beforeEach(() => {
    return createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [UserEntity],
      synchronize: true,
      logging: false,
    });
  });

  afterEach(() => {
    const conn = getConnection();
    return conn.close();
  });

  async function initRepository(): Promise<UserRepository> {
    const userRepository = await getCustomRepository(UserRepository);
    const user: UserEntity = new UserEntity({
      id: 1,
      firstName: 'Joe',
      lastName: 'Smith',
      code: 'j_s',
      password: 'SomeHash',
      mail: 'user@example.com',
      userType: UserEnum.ADMIN,
    });

    await userRepository.insert(user);

    return userRepository;
  }

  describe('FindByCredentials', () => {
    test('fetch by code/pwd findByCredentials', async () => {
      const userRepository = await initRepository();

      const joe = await userRepository.findByCredentials('j_s', 'SomeHash');
      expect(joe.firstName).toBe('Joe');
    });

    test('fetch by mail/pwd findByCredentials', async () => {
      const userRepository = await initRepository();

      const joe = await userRepository.findByCredentials('user@example.com', 'SomeHash');
      expect(joe.firstName).toBe('Joe');
    });

    test('fail findByCredentials (No User found)', async () => {
      const userRepository = await initRepository();

      await expect(userRepository.findByCredentials('no user', 'SomeHash')).rejects.toThrowError();
    });
  });

  describe('Search User', () => {
    test('Search by partial firstName', async () => {
      const userRepository = await initRepository();

      const joe = await userRepository.findBySearchArg('Jo');
      expect(joe[0].firstName).toBe('Joe');
    });

    test('Search by partial lastName', async () => {
      const userRepository = await initRepository();

      const joe = await userRepository.findBySearchArg('Sm');
      expect(joe[0].lastName).toBe('Smith');
    });

    test('Search by partial code', async () => {
      const userRepository = await initRepository();

      const joe = await userRepository.findBySearchArg('j_');
      expect(joe[0].code).toBe('j_s');
    });

    test('case insensitive', async () => {
      const userRepository = await initRepository();

      const joe = await userRepository.findBySearchArg('smi');
      expect(joe[0].code).toBe('j_s');
    });

    test('Search multiple results', async () => {
      const userRepository = await initRepository();
      const user_1: UserEntity = new UserEntity({
        id: 3,
        firstName: 'John',
        lastName: 'Mustermann',
        code: 'john',
        password: 'SomeHash',
        mail: 'user_1@example.com',
        userType: UserEnum.ADMIN,
      });

      const user_2: UserEntity = new UserEntity({
        id: 4,
        firstName: 'Johannes',
        lastName: 'Mustermann',
        code: 'johannesM',
        password: 'SomeHash',
        mail: 'user_2@example.com',
        userType: UserEnum.ADMIN,
      });

      const user_3: UserEntity = new UserEntity({
        id: 5,
        firstName: 'Johnson',
        lastName: 'Mustermann',
        code: 'johnsonMu',
        password: 'SomeHash',
        mail: 'user_3@example.com',
        userType: UserEnum.ADMIN,
      });

      await userRepository.insert(user_1);
      await userRepository.insert(user_2);
      await userRepository.insert(user_3);

      const users = await userRepository.findBySearchArg('Joh');
      expect(users).toHaveLength(3);
      expect(users[0].code).toBe(user_1.code);
      expect(users[1].code).toBe(user_2.code);
      expect(users[2].code).toBe(user_3.code);
    });

    test('Search multiple results with Limit', async () => {
      const userRepository = await initRepository();
      const user_1: UserEntity = new UserEntity({
        id: 3,
        firstName: 'John',
        lastName: 'Mustermann',
        code: 'john',
        password: 'SomeHash',
        mail: 'user_1@example.com',
        userType: UserEnum.ADMIN,
      });

      const user_2: UserEntity = new UserEntity({
        id: 4,
        firstName: 'Johannes',
        lastName: 'Mustermann',
        code: 'johannesM',
        password: 'SomeHash',
        mail: 'user_2@example.com',
        userType: UserEnum.ADMIN,
      });

      const user_3: UserEntity = new UserEntity({
        id: 5,
        firstName: 'Johnson',
        lastName: 'Mustermann',
        code: 'johnsonMu',
        password: 'SomeHash',
        mail: 'user_3@example.com',
        userType: UserEnum.ADMIN,
      });

      await userRepository.insert(user_1);
      await userRepository.insert(user_2);
      await userRepository.insert(user_3);

      const users = await userRepository.findBySearchArg('Joh', 2);
      expect(users).toHaveLength(2);
      expect(users[0].code).toBe(user_1.code);
      expect(users[1].code).toBe(user_2.code);
    });
  });

  describe('SaveOrUpdate', () => {
    test('Save new Item', async () => {
      const userRepository = await getCustomRepository(UserRepository);
      const user: UserEntity = new UserEntity({
        id: 0,
        firstName: 'SaveBoy',
        lastName: 'SaveBoy',
        code: 'ssb',
        password: 'SomeHash',
        mail: 'saveboy@example.com',
        userType: UserEnum.ADMIN,
      });
      await userRepository.saveOrUpdate(user);

      const actual = await userRepository.findByCredentials(user.code, user.password);
      expect(actual.firstName).toBe(user.firstName);
    });

    test('update existing Item', async () => {
      const userRepository = await initRepository();
      const user = await userRepository.findOne(1);
      expect(user.firstName).toBe('Joe');
      user.firstName = 'Hans';

      await userRepository.saveOrUpdate(user);

      const actual = await userRepository.findByCredentials(user.code, user.password);
      expect(actual.firstName).toBe(user.firstName);
    });

    test('fail validation on save or update', async () => {
      const userRepository = await getCustomRepository(UserRepository);
      const user: UserEntity = plainToClass(UserEntity, {
        id: 0, //only id == 0 will insert
        firstName: '',
        lastName: '',
        code: 'ssb', //not empty to be able to check later
        password: 'SomeHash', //not empty to be able to check later
        mail: 'saveboyexample.com', //No Mail Format
        userType: UserEnum.ADMIN,
      });

      //test validation itself
      expect((await validate(user)).length).toBeGreaterThan(0);
      //should not save user cause validation errors
      try {
        await userRepository.saveOrUpdate(user);
      } catch (e) {
        if (Array.isArray(e) && e[0] instanceof ValidationError) {
          expect(e[0].property).toBe('firstName');
          expect(e[1].property).toBe('lastName');
          expect(e[2].property).toBe('mail');
        } else {
          fail('This should not have happened: ' + e);
        }
      }
      //should not find user either
      await expect(userRepository.findByCredentials(user.code, user.password)).rejects.toThrowError();
    });
  });
});
