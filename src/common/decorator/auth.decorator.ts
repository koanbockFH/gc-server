import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserTypeGuard } from 'src/auth/user-type.guard';

export function Auth(): any {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, UserTypeGuard),
    ApiForbiddenResponse({ description: 'Unauthorized | Forbidden' }),
    ApiUnauthorizedResponse({ description: 'Unauthenticated' }),
  );
}
