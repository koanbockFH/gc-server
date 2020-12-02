export class StudentModuleStatsDTO {
  constructor(defaultValues: Partial<StudentModuleStatsDTO> = {}) {
    if (defaultValues == null) return;
    this.name = defaultValues.name;
    this.code = defaultValues.code;
    this.description = defaultValues.description;
    this.attended = defaultValues.attended;
    this.absent = defaultValues.absent;
    this.classes = defaultValues.classes;
    this.total = defaultValues.total;
    this.id = defaultValues.id;
  }
  id: number;
  name: string;
  code: string;
  description: string;
  attended: number;
  absent: number;
  classes: number;
  total: number;
}
