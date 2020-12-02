import { ApiProperty } from '@nestjs/swagger';
import { StatsDTO } from './stats.dto';

export class TeacherTimeSlotStatsDTO extends StatsDTO {
  constructor(defaultValues: Partial<TeacherTimeSlotStatsDTO> = {}) {
    if (defaultValues == null) return;
    super(defaultValues);
    this.name = defaultValues.name;
    this.startDate = defaultValues.startDate;
    this.endDate = defaultValues.endDate;
    this.attended = defaultValues.attended;
    this.absent = defaultValues.absent;
    this.total = defaultValues.total;
    this.id = defaultValues.id;
  }
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  startDate: Date;
  @ApiProperty()
  endDate: Date;
}
