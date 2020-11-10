import { ApiProperty } from '@nestjs/swagger';
import { UserEnum } from '../enum/user.enum';

export class UserDTO {
  constructor(defaultValues: Partial<UserDTO> = {}) {
    this.mapValues(defaultValues);
  }

  mapValues(defaultValues: Partial<UserDTO> = {}): void {
    if (defaultValues == null) return;
    this.id = defaultValues.id;
    this.firstName = defaultValues.firstName;
    this.lastName = defaultValues.lastName;
    this.code = defaultValues.code;
    this.mail = defaultValues.mail;
    this.userType = defaultValues.userType;
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  mail: string;

  @ApiProperty()
  userType: UserEnum;
}
