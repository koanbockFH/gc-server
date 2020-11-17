import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestWithUser } from './interfaces.interface';
import { UserEnum } from '../users/enum/user.enum';

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredUserTypes = this.reflector.getAllAndMerge<UserEnum[]>('userTypes', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredUserTypes || requiredUserTypes.length == 0) return true;
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const user = request.user;
    const hasUserType = () => requiredUserTypes.some(type => type == user.userType) || user.userType == 0;

    if (user && hasUserType()) {
      return true;
    }
    throw new HttpException('You do not have permissions for that', HttpStatus.FORBIDDEN);
  }
}
