import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from 'src/users/dto/user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'codeOrMail',
      passwordField: 'password',
    });
  }

  /**
   * Validate user by user exists and valid password
   * @param codeOrMail Code or mail which is provided by the request
   * @param password Password which is provided by the request (plain)
   */
  async validate(codeOrMail: string, password: string): Promise<UserDTO> {
    const user = await this.authService.validateUser(codeOrMail, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
