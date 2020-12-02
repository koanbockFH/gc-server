import { ApiProperty } from '@nestjs/swagger';

export class StatsDTO {
  constructor(defaultValues: Partial<StatsDTO> = {}) {
    if (defaultValues == null) return;
    this.attended = defaultValues.attended;
    this.absent = defaultValues.absent;
    this.total = defaultValues.total;
  }
  @ApiProperty()
  attended: number;
  @ApiProperty()
  absent: number;
  @ApiProperty()
  total: number;
}
