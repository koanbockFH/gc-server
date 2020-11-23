export class TeacherModuleStatsDTO {
  name: string;
  code: string;
  description: string;
  teacher: {
    firstName: string;
    lastName: string;
    code: string;
  };
  attended: number;
  absent: number;
  classes: number;
  total: number;
}
