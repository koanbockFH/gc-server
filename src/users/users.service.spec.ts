import { Test, TestingModule } from '@nestjs/testing';
import { getCustomRepositoryToken } from '@nestjs/typeorm';
import { UserDTO } from './dto/user.dto';
import { User } from './user.entity';
import { UserRepository } from './users.repository';
import { UsersService } from './users.service';

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
    const expected = [new User()];
    jest.spyOn(repository, 'findBySearchArg').mockResolvedValueOnce(expected);
    const actual = await service.getUsersByQuery('Julian');
    expect(actual).toBe(expected);
  });

  test('getUserById', async () => {
    const expected = new User();
    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(expected);
    const actual = await service.getUserById(1);
    expect(actual).toBe(expected);
  });

  test('saveOrUpdate', async () => {
    const user: UserDTO = {
      id: 0,
      firstName: 'Max',
      lastName: 'Mustermann',
      username: 'maximus',
      password: 'SomeHash',
      mail: 'max@mustermann.com',
    };
    repository.saveOrUpdate = jest.fn();
    await service.saveOrUpdate(user);
    expect(repository.saveOrUpdate).toHaveBeenCalledWith(Object.assign(new User(), user));
  });
});
