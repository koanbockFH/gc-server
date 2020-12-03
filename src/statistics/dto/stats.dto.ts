import { ApiProperty } from '@nestjs/swagger';

export class StatsDTO {
  constructor(defaultValues: Partial<StatsDTO> = {}) {
    if (defaultValues == null) return;
    this.attended = defaultValues.attended;
    this.absent = defaultValues.absent;
    this.totalStudents = defaultValues.totalStudents;
  }
  @ApiProperty()
  attended: number;
  @ApiProperty()
  absent: number;
  @ApiProperty()
  totalStudents: number;
}
