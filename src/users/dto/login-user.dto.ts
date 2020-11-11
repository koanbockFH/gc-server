import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  codeOrMail: string;
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
