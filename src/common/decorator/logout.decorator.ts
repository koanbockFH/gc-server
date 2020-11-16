import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const Logout = (): CustomDecorator<string> => SetMetadata('logout', true);
