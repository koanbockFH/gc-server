import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserEnum } from '../enum/user.enum';
import { UserDTO } from './user.dto';

export class RegisterUserDTO extends UserDTO {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;
  @ApiProperty()
  @IsNotEmpty()
  lastName: string;
  @ApiProperty()
  @IsNotEmpty()
  code: string;
  @ApiProperty()
  @IsEmail()
  mail: string;
  @ApiProperty()
  @IsNotEmpty()
  password: string;
  @ApiProperty()
  @IsEnum(UserEnum)
  userType: UserEnum;
}
