import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { RegisterUserDTO } from 'src/users/dto/register-user.dto';
import { UserDTO } from 'src/users/dto/user.dto';
import { UserEntity } from 'src/users/user.entity';
import { AccessToken, Message } from './interfaces.interface';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  /**
   * Checks if user is valid and the password is correct
   * @param codeOrMail Given code or mail of user - Later going to be email
   * @param password Given password of user (plain)
   */
  async validateUser(codeOrMail: string, password: string): Promise<UserDTO> {
    const user = await this.usersService.getUsersByQuery(codeOrMail);
    if (user && bcrypt.compareSync(password, user[0].password)) {
      delete user[0].password;
      return user[0];
    }
    return null;
  }

  /**
   * Provides the JWT access token if login succeeded
   * @param user User object which gets from database
   */
  async login(user: UserEntity): Promise<AccessToken> {
    const payload = { userId: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Register a new user
   * @param user User object which gets from database
   */
  async register(user: RegisterUserDTO): Promise<Message> {
    await this.usersService.saveOrUpdate(user);
    return {
      message: 'The user ' + user.code + ' was created',
    };
  }
}
