import { Test, TestingModule } from '@nestjs/testing';
import { getCustomRepositoryToken } from '@nestjs/typeorm';
import { RegisterUserDTO } from './dto/register-user.dto';
import { UserDTO } from './dto/user.dto';
import { UserEnum } from './enum/user.enum';
import { UserEntity } from './user.entity';
import { UserRepository } from './users.repository';
import { UsersService } from './users.service';
import * as bcrypt from 'bcryptjs';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: getCustomRepositoryToken(UserRepository), useClass: UserRepository }],
      exports: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UserRepository>(getCustomRepositoryToken(UserRepository));
  });

  test('getBySearchArg', async () => {
    const expected = [new UserEntity()];
    jest.spyOn(repository, 'findBySearchArg').mockResolvedValueOnce(expected);
    const actual = await service.getUsersByQuery('Julian');
    expect(actual).toBe(expected);
  });

  test('getUserById', async () => {
    const expected = new UserEntity();
    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(expected);
    const actual = await service.getUserById(1);
    expect(actual).toEqual(new UserDTO(expected));
  });

  test('saveOrUpdate', async () => {
    const user: RegisterUserDTO = {
      firstName: 'Max',
      lastName: 'Mustermann',
      code: 'maximus',
      password: bcrypt.hashSync('SomeHash', 8),
      mail: 'max@mustermann.com',
      userType: UserEnum.STUDENT,
    };
    repository.saveOrUpdate = jest.fn();
    await service.saveOrUpdate(user);
    expect(repository.saveOrUpdate).toHaveBeenCalledTimes(1);
  });

  describe('getPublic', () => {
    const savedValue = new UserEntity({
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      code: 'T007',
      mail: 'user@example.com',
      createdAt: new Date(2020, 10, 10),
      updatedAt: new Date(2020, 10, 10),
      userType: UserEnum.TEACHER,
    });

    test('successful get', async () => {
      repository.paginate = jest.fn();
      jest
        .spyOn(repository, 'paginate')
        .mockResolvedValueOnce({ items: [savedValue, savedValue], currentPage: 1, totalPages: 1 });
      await expect(service.getAll({ userType: UserEnum.TEACHER }, { page: 1 })).resolves.toEqual({
        items: [new UserDTO(savedValue), new UserDTO(savedValue)],
        currentPage: 1,
        totalPages: 1,
      });
    });

    test('failed get', async () => {
      repository.paginate = jest.fn();
      jest.spyOn(repository, 'paginate').mockResolvedValueOnce({ items: [], currentPage: 1, totalPages: 1 });
      const result = await service.getAll({ userType: UserEnum.TEACHER }, { page: 1 });
      expect(result.items).toHaveLength(0);
    });
  });
});
