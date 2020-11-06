import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AppService } from './app.service';

@ApiTags('app')
@Controller('/api/v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async checkRunning(@Res() res: Response): Promise<void> {
    const status = await this.appService.checkRunning();
    res.status(HttpStatus.OK).json({ message: status });
  }
}
