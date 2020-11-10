import { Test, TestingModule } from '@nestjs/testing';
import { getCustomRepositoryToken } from '@nestjs/typeorm';
import { RegisterUserDTO } from './dto/register-user.dto';
import { UserDTO } from './dto/user.dto';
import { UserEnum } from './enum/user.enum';
import { UserEntity } from './user.entity';
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
      password: 'SomeHash',
      mail: 'max@mustermann.com',
      userType: UserEnum.STUDENT,
    };
    repository.saveOrUpdate = jest.fn();
    await service.saveOrUpdate(user);
    //TODO we need to adjust this test, since password is hashed it is no longer working
    expect(repository.saveOrUpdate).toHaveBeenCalledTimes(1);
  });
});
