import { ApiProperty } from '@nestjs/swagger';
import { TimeSlotDTO } from 'src/modules/timeslots/dto/time-slots.dto';

export class TimeSlotAAStatsDTO {
  constructor(defaultValues: Partial<TimeSlotAAStatsDTO> = {}) {
    if (defaultValues == null) return;
    this.attended = defaultValues.attended;
    this.absent = defaultValues.absent;
  }

  @ApiProperty({ type: TimeSlotDTO, isArray: true })
  attended: TimeSlotDTO[];
  @ApiProperty({ type: TimeSlotDTO, isArray: true })
  absent: TimeSlotDTO[];
}
