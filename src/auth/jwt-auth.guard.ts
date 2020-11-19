import { ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';

/**
 * Abstraction of authguard to give possibility to handle other stuff as well
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(@Inject('AuthService') private readonly authService: AuthService, private reflector: Reflector) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isLogout = this.reflector.getAllAndMerge<boolean[]>('logout', [context.getHandler(), context.getClass()]);
    const req = context.switchToHttp().getRequest();
    try {
      const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      if (!accessToken) {
        throw new UnauthorizedException('No access token set.');
      }

      const isValidToken = await this.authService.validateToken(accessToken);
      if (!isValidToken) {
        throw new UnauthorizedException();
      }
      if (isLogout[0] !== undefined && isLogout[0]) {
        await this.authService.logout(accessToken);
      }
      return this.activate(context);
    } catch (err) {
      return false;
    }
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }
}
