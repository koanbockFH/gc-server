import { ApiProperty } from '@nestjs/swagger';
import { UserDTO } from 'src/users/dto/user.dto';

export class TeacherStudentsStatsDTO extends UserDTO {
  constructor(defaultValues: Partial<TeacherStudentsStatsDTO> = {}) {
    if (defaultValues == null) return;
    super(defaultValues);
    this.attended = defaultValues.attended;
    this.absent = defaultValues.absent;
    this.totalTimeslots = defaultValues.totalTimeslots;
    this.totalStudents = defaultValues.totalStudents;
  }
  @ApiProperty()
  attended: number;
  @ApiProperty()
  absent: number;
  @ApiProperty()
  totalTimeslots: number;
  @ApiProperty()
  totalStudents: number;
}
