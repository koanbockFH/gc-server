import { Body, Controller, Get, HttpStatus, Post, Request, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDTO } from 'src/users/dto/login-user.dto';
import { RegisterUserDTO } from 'src/users/dto/register-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { RequestWithUser, AccessToken, Message } from './interfaces.interface';
import { UserDTO } from 'src/users/dto/user.dto';
import { Auth } from 'src/common/decorator/auth.decorator';
import { Logout } from 'src/common/decorator/logout.decorator';
import { Response } from 'express';

@ApiTags('auth')
@Controller('/api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginUserDTO })
  @ApiResponse({
    status: 401,
    description: 'code/mail or password is incorrect, so unauthorized.',
  })
  @ApiResponse({ status: 201, description: 'Successfully logged in' })
  async login(@Request() req: RequestWithUser): Promise<AccessToken> {
    return this.authService.login(req.user);
  }

  @ApiBody({ type: RegisterUserDTO })
  @ApiResponse({
    status: 409,
    description: 'User with this code is already registered.',
  })
  @ApiResponse({
    status: 409,
    description: 'User with this mail is already registered.',
  })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @Post('register')
  async register(@Body() registerUser: RegisterUserDTO): Promise<Message> {
    return this.authService.register(registerUser);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: RequestWithUser): Promise<UserDTO> {
    return new UserDTO(req.user);
  }

  @Auth()
  @ApiResponse({ status: 200, description: 'Successfully logged out.' })
  @Logout()
  @Post('/logout')
  async logout(@Res() res: Response): Promise<void> {
    res.status(HttpStatus.OK).json({ message: 'Successfully logged out.' });
  }
}
