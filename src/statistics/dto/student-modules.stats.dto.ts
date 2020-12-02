import { ApiProperty } from '@nestjs/swagger';
import { StudentModuleStatsDTO } from './student-module.stats.dto';

export class StudentModulesStatisticsDTO {
  constructor(defaultValues: Partial<StudentModulesStatisticsDTO>) {
    this.modules = defaultValues.modules;
  }
  @ApiProperty({ type: StudentModuleStatsDTO, isArray: true })
  modules: StudentModuleStatsDTO[];
}
