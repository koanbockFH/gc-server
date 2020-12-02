export class TeacherTimeSlotStatsDTO {
  constructor(defaultValues: Partial<TeacherTimeSlotStatsDTO>) {
    this.name = defaultValues.name;
    this.startDate = defaultValues.startDate;
    this.endDate = defaultValues.endDate;
    this.attended = defaultValues.attended;
    this.absent = defaultValues.absent;
    this.total = defaultValues.total;
    this.id = defaultValues.id;
  }
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  attended: number;
  absent: number;
  total: number;
}
