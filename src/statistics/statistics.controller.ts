import { Controller, Get, Param, Request } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/auth/interfaces.interface';
import { Auth } from 'src/common/decorator/auth.decorator';
import { ApiCommonResponse } from 'src/common/decorator/commonApi.decorator';
import { UserTypes } from 'src/common/decorator/user-type.decorator';
import { UserEnum } from 'src/users/enum/user.enum';
import { TeacherModuleStudentStatsDTO } from './dto/teacher-module-student.stats.dto';
import { TeacherTimeSlotStatsDTO } from './dto/teacher-timeslot.stats.dto';
import { StatisticsService } from './statistics.service';
import { TeacherModuleStatsDTO } from './dto/teacher-module.stats.dto';
import { StudentModuleStatsDTO } from './dto/student-module.stats.dto';
import { TimeSlotAAStatsDTO } from './dto/timeslot-aa.stats.dto';

@Auth()
@ApiTags('statistics')
@Controller('/api/v1/statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @ApiCommonResponse({ type: StudentModuleStatsDTO, isArray: true })
  @UserTypes(UserEnum.STUDENT)
  @Get()
  async getUserStatistics(@Request() req: RequestWithUser): Promise<StudentModuleStatsDTO[]> {
    return await this.statisticsService.getUserStatistics(req.user.id);
  }

  @ApiCommonResponse({ type: TeacherTimeSlotStatsDTO })
  @ApiParam({ name: 'timeslotId', type: Number })
  @UserTypes(UserEnum.TEACHER)
  @Get('/module/timeslot/:timeslotId')
  async getTimeslotByIdStatistics(
    @Request() req: RequestWithUser,
    @Param('timeslotId') timeslotId: number,
  ): Promise<TeacherTimeSlotStatsDTO> {
    return await this.statisticsService.getTimeslotByIdStatistics(req.user, timeslotId);
  }

  @ApiCommonResponse({ type: TeacherModuleStatsDTO, isArray: true })
  @ApiParam({ name: 'studentId', type: Number })
  @UserTypes(UserEnum.TEACHER)
  @Get('/module/student/:studentId')
  async getStudentStatistics(
    @Request() req: RequestWithUser,
    @Param('studentId') studentId: number,
  ): Promise<TeacherModuleStatsDTO[]> {
    return await this.statisticsService.getStudentStatistics(req.user, studentId);
  }

  @ApiCommonResponse({ type: TeacherModuleStudentStatsDTO })
  @ApiParam({ name: 'moduleId', type: Number })
  @UserTypes(UserEnum.TEACHER)
  @Get('/module/:moduleId')
  async getModuleStatistics(
    @Request() req: RequestWithUser,
    @Param('moduleId') moduleId: number,
  ): Promise<TeacherModuleStudentStatsDTO> {
    return await this.statisticsService.getModuleStatistics(req.user, moduleId);
  }

  @ApiCommonResponse({ type: TeacherTimeSlotStatsDTO, isArray: true })
  @ApiParam({ name: 'moduleId', type: Number })
  @UserTypes(UserEnum.TEACHER)
  @Get('/module/:moduleId/timeslot')
  async getTimeslotsStatistics(
    @Request() req: RequestWithUser,
    @Param('moduleId') moduleId: number,
  ): Promise<TeacherTimeSlotStatsDTO[]> {
    return await this.statisticsService.getTimeslotsStatistics(req.user, moduleId);
  }

  @ApiCommonResponse({ type: TimeSlotAAStatsDTO })
  @ApiParam({ name: 'moduleId', type: Number })
  @ApiParam({ name: 'studentId', type: Number })
  @UserTypes(UserEnum.TEACHER)
  @Get('/module/:moduleId/student/:studentId')
  async getTimeSlotsAAA(
    @Request() req: RequestWithUser,
    @Param('moduleId') moduleId: number,
    @Param('studentId') studentId: number,
  ): Promise<TimeSlotAAStatsDTO> {
    return await this.statisticsService.getTimeSlotsAAA(req.user, moduleId, studentId);
  }

  @ApiCommonResponse({ type: TeacherModuleStatsDTO, isArray: true })
  @UserTypes(UserEnum.ADMIN)
  @Get('/module')
  async getModulesStatistics(): Promise<TeacherModuleStatsDTO[]> {
    return await this.statisticsService.getModulesStatistics();
  }
}
