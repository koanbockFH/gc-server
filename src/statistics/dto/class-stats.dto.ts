import { ApiProperty } from '@nestjs/swagger';
import { StatsDTO } from './stats.dto';

export class ClassStatsDTO extends StatsDTO {
  constructor(defaultValues: Partial<ClassStatsDTO> = {}) {
    if (defaultValues == null) return;
    super(defaultValues);
    this.totalTimeslots = defaultValues.totalTimeslots;
  }
  @ApiProperty()
  totalTimeslots: number;
}
