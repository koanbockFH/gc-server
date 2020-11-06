import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getCustomRepositoryToken } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/users.repository';
import { UserDTO } from 'src/users/dto/user.dto';

jest.mock('bcryptjs');

describe('The AuthenticationService', () => {
  let bcryptCompare: jest.Mock;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compareSync as jest.Mock) = bcryptCompare;
    const mockedJwtService = {
      sign: () => '',
    };
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthService,
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getCustomRepositoryToken(UserRepository),
          useClass: UserRepository,
        },
      ],
      exports: [UsersService],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('when accessing the data of authenticating user', () => {
    it('should attempt to get a user by query', async () => {
      usersService.getUsersByQuery = jest.fn();
      await authService.validateUser('user@email.com', 'strongPassword');
      expect(usersService.getUsersByQuery).toHaveBeenCalledWith('user@email.com');
    });
    describe('and the provided password is not valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(false);
      });
      it('should throw an error', async () => {
        await expect(authService.validateUser('user@email.com', 'strongPassword')).rejects.toThrow();
      });
    });
    describe('and the provided password is valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(true);
      });
      describe('and the user is found in the database', () => {
        it('should return the user data', async () => {
          const userData: UserDTO = {
            firstName: 'Max',
            lastName: 'Mustermann',
            username: 'maximus',
            password: 'SomeHash',
            mail: 'max@mustermann.com',
          };

          usersService.getUsersByQuery = jest.fn().mockReturnValue([userData]);
          const user = await authService.validateUser('max@mustermann.com', 'SomeHash');

          expect(user.mail).toBe(userData.mail);
        });
      });
      describe('and the user is not found in the database', () => {
        it('should throw an error', async () => {
          await expect(authService.validateUser('user@email.com', 'strongPassword')).rejects.toThrow();
        });
      });
    });
  });
});
