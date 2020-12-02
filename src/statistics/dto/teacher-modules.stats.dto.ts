import { ApiProperty } from '@nestjs/swagger';
import { TeacherModuleStatsDTO } from './teacher-module.stats.dto';

export class TeacherModulesStatisticsDTO {
  constructor(defaultValues: Partial<TeacherModulesStatisticsDTO>) {
    this.modules = defaultValues.modules;
  }
  @ApiProperty({ type: TeacherModuleStatsDTO, isArray: true })
  modules: TeacherModuleStatsDTO[];
}
