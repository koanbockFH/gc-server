import { TeacherTimeSlotStatsDTO } from './teacher-timeslot.stats.dto';

export class TeacherAllTimeSlotsDTO {
  constructor(defaultValues: Partial<TeacherAllTimeSlotsDTO> = {}) {
    if (defaultValues == null) return;
    this.name = defaultValues.name;
    this.code = defaultValues.code;
    this.description = defaultValues.description;
    this.teacher = defaultValues.teacher;
    this.timeSlots = defaultValues.timeSlots;
  }
  name: string;
  code: string;
  description: string;
  teacher: {
    firstName: string;
    lastName: string;
    code: string;
  };
  timeSlots: TeacherTimeSlotStatsDTO[];
}
