import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getCustomRepositoryToken } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/users.repository';
import { RegisterUserDTO } from 'src/users/dto/register-user.dto';
import { TokenRepository } from './token/token.repository';

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
        {
          provide: getCustomRepositoryToken(TokenRepository),
          useClass: TokenRepository,
        },
      ],
      exports: [UsersService],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('when accessing the data of authenticating user', () => {
    it('should attempt to get a user by query', async () => {
      const userData: RegisterUserDTO = {
        firstName: 'Max',
        lastName: 'Mustermann',
        code: 'maximus',
        password: bcrypt.hashSync('SomeHash', 8),
        mail: 'max@mustermann.com',
        userType: 0,
      };
      usersService.getUserByCodeOrMail = jest.fn().mockReturnValue([userData]);
      await authService.validateUser('user@email.com', 'strongPassword');
      expect(usersService.getUserByCodeOrMail).toHaveBeenCalledWith('user@email.com');
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
          const userData: RegisterUserDTO = {
            firstName: 'Max',
            lastName: 'Mustermann',
            code: 'maximus',
            password: 'SomeHash',
            mail: 'max@mustermann.com',
            userType: 0,
          };

          usersService.getUserByCodeOrMail = jest.fn().mockReturnValue([userData]);
          authService.validateUser = jest.fn().mockReturnValue([userData]);
          const user = await authService.validateUser('max@mustermann.com', 'SomeHash');

          expect(user.mail).toBeUndefined();
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
