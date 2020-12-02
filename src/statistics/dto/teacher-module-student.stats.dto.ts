import { ApiProperty } from '@nestjs/swagger';
import { TeacherModuleStatsDTO } from './teacher-module.stats.dto';
import { TeacherStudentsStatsDTO } from './teacher-students.stats.dto';

export class TeacherModuleStudentStatsDTO extends TeacherModuleStatsDTO {
  constructor(defaultValues: Partial<TeacherModuleStudentStatsDTO> = {}) {
    if (defaultValues == null) return;
    super(defaultValues);
    this.students = defaultValues.students;
  }
  @ApiProperty({ type: TeacherStudentsStatsDTO, isArray: true })
  students: TeacherStudentsStatsDTO[];
}
