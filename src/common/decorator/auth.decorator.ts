import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

export function Auth(): any {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard),
    ApiForbiddenResponse({ description: 'Unauthorized | Forbidden' }),
    ApiUnauthorizedResponse({ description: 'Unauthenticated' }),
  );
}
