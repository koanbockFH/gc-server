import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { UserEnum } from 'src/users/enum/user.enum';

//define usertypes for a specific method
export const UserTypes = (...userTypes: UserEnum[]): CustomDecorator<string> => SetMetadata('userTypes', userTypes);
