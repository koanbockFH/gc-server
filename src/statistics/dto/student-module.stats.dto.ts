import { ApiProperty } from '@nestjs/swagger';
import { ClassStatsDTO } from './class-stats.dto';

/**
 * statistics for a student and their specific module performance
 */
export class StudentModuleStatsDTO extends ClassStatsDTO {
  constructor(defaultValues: Partial<StudentModuleStatsDTO> = {}) {
    if (defaultValues == null) return;
    super(defaultValues);
    this.name = defaultValues.name;
    this.code = defaultValues.code;
    this.description = defaultValues.description;
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
}
