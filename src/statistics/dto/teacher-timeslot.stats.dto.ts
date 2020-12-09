import { ApiProperty } from '@nestjs/swagger';
import { UserDTO } from 'src/users/dto/user.dto';
import { StatsDTO } from './stats.dto';

/**
 * Statistics of a timeslot of a specific module (from a teachers view)
 */
export class TeacherTimeSlotStatsDTO extends StatsDTO {
  constructor(defaultValues: Partial<TeacherTimeSlotStatsDTO> = {}) {
    if (defaultValues == null) return;
    super(defaultValues);
    this.name = defaultValues.name;
    this.startDate = defaultValues.startDate;
    this.endDate = defaultValues.endDate;
    this.id = defaultValues.id;
    this.attendees = defaultValues.attendees;
    this.absentees = defaultValues.absentees;
  }
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  startDate: Date;
  @ApiProperty()
  endDate: Date;
  @ApiProperty({ type: UserDTO, isArray: true })
  attendees: UserDTO[];
  @ApiProperty({ type: UserDTO, isArray: true })
  absentees: UserDTO[];
}
