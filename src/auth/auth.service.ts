import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { RegisterUserDTO } from 'src/users/dto/register-user.dto';
import { UserDTO } from 'src/users/dto/user.dto';
import { UserEntity } from 'src/users/user.entity';
import { AccessToken, Message } from './interfaces.interface';
import { TokenRepository } from './token/token.repository';
import { TokenEntity } from './token/token.entity';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService, private tokenRepo: TokenRepository) {}

  /**
   * Checks if user is valid and the password is correct
   * @param codeOrMail Given code or mail of user - Later going to be email
   * @param password Given password of user (plain)
   */
  async validateUser(codeOrMail: string, password: string): Promise<UserDTO> {
    const user = await this.usersService.getUsersByQuery(codeOrMail);
    if (user[0] === undefined) {
      throw new UnauthorizedException('Code or mail is invalid.');
    }
    if (!bcrypt.compareSync(password, user[0].password)) {
      throw new UnauthorizedException('Password is invalid.');
    }
    return new UserDTO(user[0]);
  }

  /**
   * Check if jwt token is existing
   * @param accessToken jwt token provided by the request
   */
  async validateToken(accessToken: string): Promise<boolean> {
    const token = await this.tokenRepo.findByToken(accessToken);
    return token ? true : false;
  }

  /**
   * Provides the JWT access token if login succeeded
   * @param user User object which gets from database
   */
  async login(user: UserEntity): Promise<AccessToken> {
    const payload = { userId: user.id };
    const accessToken = this.jwtService.sign(payload);
    await this.tokenRepo.saveOrUpdate(new TokenEntity({ token: accessToken }));
    return {
      access_token: accessToken,
    };
  }

  /**
   * Invalidate the given jwt token
   * @param accessToken jwt token provided by the request
   */
  async logout(accessToken: string): Promise<void> {
    await this.tokenRepo.delete({ token: accessToken });
  }

  /**
   * Register a new user
   * @param user User object which gets from database
   */
  async register(user: RegisterUserDTO): Promise<Message> {
    let check = await this.usersService.getUsersByQuery(user.code);
    if (check[0] !== undefined) {
      throw new HttpException('User with this code is already registered.', HttpStatus.CONFLICT);
    }
    check = await this.usersService.getUsersByQuery(user.mail);
    if (check[0] !== undefined) {
      throw new HttpException('User with this mail is already registered.', HttpStatus.CONFLICT);
    }
    await this.usersService.saveOrUpdate(user);
    return {
      message: 'The user ' + user.code + ' was created',
    };
  }
}
