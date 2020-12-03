import { Body, Controller, HttpException, HttpStatus, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/auth/interfaces.interface';
import { Auth } from 'src/common/decorator/auth.decorator';
import { ApiCommonResponse } from 'src/common/decorator/commonApi.decorator';
import { UserTypes } from 'src/common/decorator/user-type.decorator';
import { DuplicateEntryException } from 'src/common/exceptions/duplicateEntry.exception';
import { UserEnum } from 'src/users/enum/user.enum';
import { AttendanceService } from './attendance.service';
import { CheckInDTO } from './dto/checkIn.dto';

@Auth()
@ApiTags('attendance')
@Controller('/api/v1/attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @UserTypes(UserEnum.TEACHER)
  @ApiCommonResponse()
  @Post('/')
  async checkIn(@Request() req: RequestWithUser, @Body() checkIn: CheckInDTO): Promise<void> {
    try {
      return await this.attendanceService.checkIn(checkIn.timeslotId, checkIn.studentCode);
    } catch (e) {
      if (e instanceof DuplicateEntryException) {
        throw new HttpException(e.duplicateEntries, HttpStatus.CONFLICT);
      }
      throw e;
    }
  }
}
