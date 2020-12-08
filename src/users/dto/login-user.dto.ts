import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

/**
 * dto used for login requests
 */
export class LoginUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  codeOrMail: string;
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
