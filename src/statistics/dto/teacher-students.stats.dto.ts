import { ApiProperty } from '@nestjs/swagger';
import { UserDTO } from 'src/users/dto/user.dto';

export class TeacherStudentsStatsDTO extends UserDTO {
  constructor(defaultValues: Partial<TeacherStudentsStatsDTO> = {}) {
    if (defaultValues == null) return;
    super(defaultValues);
    this.attended = defaultValues.attended;
    this.absent = defaultValues.absent;
    this.classes = defaultValues.classes;
    this.total = defaultValues.total;
  }
  @ApiProperty()
  attended: number;
  @ApiProperty()
  absent: number;
  @ApiProperty()
  classes: number;
  @ApiProperty()
  total: number;
}
