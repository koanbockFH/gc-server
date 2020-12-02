import { Controller, Get, Param, Request } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/auth/interfaces.interface';
import { Auth } from 'src/common/decorator/auth.decorator';
import { UserTypes } from 'src/common/decorator/user-type.decorator';
import { UserEnum } from 'src/users/enum/user.enum';
import { TeacherAllTimeSlotsDTO } from './dto/teacher-all-timeslot-stats.dto';
import { TeacherModuleStudentStatsDTO } from './dto/teacher-module-student.stats.dto';
import { TeacherTimeSlotStatsDTO } from './dto/teacher-timeslot.stats.dto';
import { UserStatisticsDTO } from './dto/user.stats.dto';
import { StatisticsService } from './statistics.service';

@Auth()
@ApiTags('statistics')
@Controller('/api/v1/statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @UserTypes(UserEnum.STUDENT)
  @Get()
  async getUserStatistics(@Request() req: RequestWithUser): Promise<UserStatisticsDTO> {
    return await this.statisticsService.getUserStatistics(req.user.id);
  }

  @ApiParam({ name: 'timeslotId', type: Number })
  @UserTypes(UserEnum.TEACHER)
  @Get('/module/timeslot/:timeslotId')
  async getTimeslotByIdStatistics(
    @Request() req: RequestWithUser,
    @Param('timeslotId') timeslotId: number,
  ): Promise<TeacherTimeSlotStatsDTO> {
    return await this.statisticsService.getTimeslotByIdStatistics(req.user, timeslotId);
  }

  @ApiParam({ name: 'studentId', type: Number })
  @UserTypes(UserEnum.TEACHER)
  @Get('/module/student/:studentId')
  async getStudentStatistics(
    @Request() req: RequestWithUser,
    @Param('studentId') studentId: number,
  ): Promise<UserStatisticsDTO> {
    return await this.statisticsService.getStudentStatistics(req.user, studentId);
  }

  @ApiParam({ name: 'moduleId', type: Number })
  @UserTypes(UserEnum.TEACHER)
  @Get('/module/:moduleId')
  async getModuleStatistics(
    @Request() req: RequestWithUser,
    @Param('moduleId') moduleId: number,
  ): Promise<TeacherModuleStudentStatsDTO> {
    return await this.statisticsService.getModuleStatistics(req.user, moduleId);
  }

  @ApiParam({ name: 'moduleId', type: Number })
  @UserTypes(UserEnum.TEACHER)
  @Get('/module/:moduleId/timeslot')
  async getTimeslotsStatistics(
    @Request() req: RequestWithUser,
    @Param('moduleId') moduleId: number,
  ): Promise<TeacherAllTimeSlotsDTO> {
    return await this.statisticsService.getTimeslotsStatistics(req.user, moduleId);
  }

  @UserTypes(UserEnum.ADMIN)
  @Get('/module')
  async getModulesStatistics(): Promise<UserStatisticsDTO> {
    return await this.statisticsService.getModulesStatistics();
  }
}
