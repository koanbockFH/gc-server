import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserDTO } from './user.dto';

export class LoginUserDTO extends UserDTO {
  @ApiProperty()
  @IsNotEmpty()
  codeOrMail: string;
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
