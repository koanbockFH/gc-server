import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { UserEnum } from 'src/users/enum/user.enum';

export const UserTypes = (...userTypes: UserEnum[]): CustomDecorator<string> => SetMetadata('userTypes', userTypes);
