import { ApiProperty } from '@nestjs/swagger';
import { UserDTO } from 'src/users/dto/user.dto';
import { TeacherTimeSlotStatsDTO } from './teacher-timeslot.stats.dto';

export class TeacherAllTimeSlotsDTO {
  constructor(defaultValues: Partial<TeacherAllTimeSlotsDTO> = {}) {
    if (defaultValues == null) return;
    this.name = defaultValues.name;
    this.code = defaultValues.code;
    this.description = defaultValues.description;
    this.teacher = defaultValues.teacher;
    this.timeSlots = defaultValues.timeSlots;
  }
  @ApiProperty()
  name: string;
  @ApiProperty()
  code: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  teacher: UserDTO;
  @ApiProperty({ type: TeacherTimeSlotStatsDTO, isArray: true })
  timeSlots: TeacherTimeSlotStatsDTO[];
}
