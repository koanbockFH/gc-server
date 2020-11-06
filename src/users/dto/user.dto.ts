import { UserEnum } from '../enum/user.enum';

export class UserDTO {
  id?: number;
  firstName?: string;
  lastName?: string;
  code?: string;
  mail?: string;
  password?: string;
  userType?: UserEnum;
}
