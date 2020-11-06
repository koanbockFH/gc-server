import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Abstraction of authguard to give possibility to handle other stuff as well
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
