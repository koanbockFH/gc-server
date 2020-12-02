import { ApiProperty } from '@nestjs/swagger';
import { UserDTO } from 'src/users/dto/user.dto';
import { ClassStatsDTO } from './class-stats.dto';

export class TeacherModuleStatsDTO extends ClassStatsDTO {
  constructor(defaultValues: Partial<TeacherModuleStatsDTO> = {}) {
    if (defaultValues == null) return;
    super(defaultValues);
    this.name = defaultValues.name;
    this.code = defaultValues.code;
    this.description = defaultValues.description;
    this.teacher = defaultValues.teacher;
    this.id = defaultValues.id;
  }
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  code: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  teacher: UserDTO;
}
