import { StudentModuleStatsDTO } from './student-module.stats.dto';

export class UserStatisticsDTO {
  constructor(defaultValues: Partial<UserStatisticsDTO>) {
    this.modules = defaultValues.modules;
  }
  modules: StudentModuleStatsDTO[];
}
