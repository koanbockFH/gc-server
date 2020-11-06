import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from 'src/constants';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { Payload } from './interfaces.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    /**
     * Make some settings for JWT like extract the token from header as bearer token,
     * do not ignore expired tokens and set the app secret
     */
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: Payload): Promise<User> {
    return this.usersService.getUserById(payload.userId);
  }
}
