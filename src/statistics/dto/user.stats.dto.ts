import { StudentModuleStatsDTO } from './student-module.stats.dto';
import { TeacherModuleStatsDTO } from './teacher-module.stats.dto';

export class UserStatisticsDTO {
  modules: StudentModuleStatsDTO | TeacherModuleStatsDTO;
}
