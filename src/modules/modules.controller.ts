import { Body, Controller, Delete, Get, Param, Post, Put, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/auth/interfaces.interface';
import { Auth } from 'src/common/decorator/auth.decorator';
import { ApiCommonResponse } from 'src/common/decorator/commonApi.decorator';
import { CreateModuleDTO } from './dto/create.module.dto';
import { ModuleDTO } from './dto/module.dto';
import { ModulesService } from './modules.service';
import { CreateTimeSlotDTO } from './timeslots/dto/create.time-slots.dto';
import { TimeSlotDTO } from './timeslots/dto/time-slots.dto';
import { TimeSlotsService } from './timeslots/time-slots.service';

@Auth()
@ApiTags('modules')
@Controller('/api/v1/module')
export class ModulesController {
  constructor(private modulesService: ModulesService, private timeSlotService: TimeSlotsService) {}

  @ApiCommonResponse({ type: ModuleDTO })
  @Post('/')
  async create(@Request() req: RequestWithUser, @Body() module: CreateModuleDTO): Promise<ModuleDTO> {
    return await this.modulesService.create(module);
  }

  @ApiCommonResponse({ type: ModuleDTO })
  @Put('/')
  async edit(@Request() req: RequestWithUser, @Body() module: ModuleDTO): Promise<ModuleDTO> {
    return await this.modulesService.edit(module);
  }

  @ApiCommonResponse({ type: TimeSlotDTO })
  @Get('/timeslot/:id')
  async getTimeSlotById(@Param('id') id: number): Promise<TimeSlotDTO> {
    return await this.timeSlotService.getById(id);
  }

  @Delete('/timeslot/:id')
  async deleteTimeSlot(@Param('id') id: number): Promise<void> {
    await this.timeSlotService.delete(id);
  }

  @ApiCommonResponse({ type: ModuleDTO })
  @Get('/:id')
  async getById(@Request() req: RequestWithUser, @Param('id') id: number): Promise<ModuleDTO> {
    return await this.modulesService.getById(id);
  }

  @ApiCommonResponse({ type: ModuleDTO, isArray: true })
  @Get('/')
  async getAllByUser(@Request() req: RequestWithUser): Promise<ModuleDTO[]> {
    return await this.modulesService.getAllByUser(req.user.id);
  }

  @Delete('/:id')
  async delete(@Request() req: RequestWithUser, @Param('id') id: number): Promise<void> {
    await this.modulesService.delete(id);
  }

  @ApiCommonResponse({ type: TimeSlotDTO })
  @Post('/:moduleId/timeslot')
  async createTimeSlot(@Param('moduleId') moduleId: number, @Body() timeSlot: CreateTimeSlotDTO): Promise<TimeSlotDTO> {
    return await this.timeSlotService.create(moduleId, timeSlot);
  }

  @ApiCommonResponse({ type: TimeSlotDTO })
  @Put('/:moduleId/timeslot')
  async editTimeSlot(@Param('moduleId') moduleId: number, @Body() timeSlot: TimeSlotDTO): Promise<TimeSlotDTO> {
    return await this.timeSlotService.edit(moduleId, timeSlot);
  }

  @ApiCommonResponse({ type: TimeSlotDTO, isArray: true })
  @Get('/:moduleId/timeslot')
  async getAllTimeSlots(@Param('moduleId') moduleId: number): Promise<TimeSlotDTO[]> {
    return await this.timeSlotService.getAll(moduleId);
  }
}
