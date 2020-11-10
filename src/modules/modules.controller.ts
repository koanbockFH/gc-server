import { Body, Controller, Delete, Get, Param, Post, Put, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/auth/interfaces.interface';
import { Auth } from 'src/common/decorator/auth.decorator';
import { ApiCommonResponse } from 'src/common/decorator/commonApi.decorator';
import { CreateModuleDTO } from './dto/create.module.dto';
import { ModuleDTO } from './dto/module.dto';
import { ModulesService } from './modules.service';

@Auth()
@ApiTags('modules')
@Controller('/api/v1/module')
export class ModulesController {
  constructor(private modulesService: ModulesService) {}

  @Auth()
  @ApiCommonResponse({ type: ModuleDTO })
  @Post('/')
  async create(@Request() req: RequestWithUser, @Body() module: CreateModuleDTO): Promise<ModuleDTO> {
    return await this.modulesService.create(module);
  }

  @Auth()
  @ApiCommonResponse({ type: ModuleDTO })
  @Put('/')
  async edit(@Request() req: RequestWithUser, @Body() module: ModuleDTO): Promise<ModuleDTO> {
    return await this.modulesService.edit(module);
  }

  @Auth()
  @ApiCommonResponse({ type: ModuleDTO })
  @Get('/:id')
  async getById(@Request() req: RequestWithUser, @Param('id') id: number): Promise<ModuleDTO> {
    return await this.modulesService.getById(id);
  }

  @Auth()
  @ApiCommonResponse({ type: ModuleDTO, isArray: true })
  @Get('/')
  async getAllByUser(@Request() req: RequestWithUser): Promise<ModuleDTO[]> {
    return await this.modulesService.getAllByUser(req.user.id);
  }

  @Auth()
  @Delete('/:id')
  async delete(@Request() req: RequestWithUser, @Param('id') id: number): Promise<void> {
    await this.modulesService.delete(id);
  }
}
