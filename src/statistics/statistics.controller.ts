import { Controller, Get, Param, Request } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/auth/interfaces.interface';
import { Auth } from 'src/common/decorator/auth.decorator';
import { UserTypes } from 'src/common/decorator/user-type.decorator';
import { UserEnum } from 'src/users/enum/user.enum';

@Auth()
@ApiTags('statistics')
@Controller('/api/v1/statistics')
export class StatisticsController {
  constructor() {}

  @UserTypes(UserEnum.STUDENT)
  @Get()
  async getUserStatistics(@Request() req: RequestWithUser): Promise<void> {}

  @ApiParam({ name: 'moduleId', type: Number })
  @UserTypes(UserEnum.TEACHER)
  @Get('/module/:moduleId')
  async getModuleStatistics(@Request() req: RequestWithUser, @Param('moduleId') moduleId: number): Promise<void> {}

  @ApiParam({ name: 'moduleId', type: Number })
  @UserTypes(UserEnum.TEACHER)
  @Get('/module/:moduleId/timeslot')
  async getTimeslotsStatistics(@Request() req: RequestWithUser, @Param('moduleId') moduleId: number): Promise<void> {}

  @ApiParam({ name: 'moduleId', type: Number })
  @ApiParam({ name: 'timeslotId', type: Number })
  @UserTypes(UserEnum.TEACHER)
  @Get('/module/:moduleId/timeslot/:timeslotId')
  async getTimeslotByIdStatistics(
    @Request() req: RequestWithUser,
    @Param('moduleId') moduleId: number,
    @Param('timeslotId') timeslotId: number,
  ): Promise<void> {}

  @ApiParam({ name: 'studentId', type: Number })
  @UserTypes(UserEnum.TEACHER)
  @Get('/module/student/:studentId')
  async getStudentStatistics(@Request() req: RequestWithUser, @Param('studentId') studentId: number): Promise<void> {}

  @UserTypes(UserEnum.ADMIN)
  @Get('/module/:moduleId/timeslot')
  async getModulesStatistics(@Request() req: RequestWithUser): Promise<void> {}
}
