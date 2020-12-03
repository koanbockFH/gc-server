import { ApiProperty } from '@nestjs/swagger';
import { TimeSlotDTO } from 'src/modules/timeslots/dto/time-slots.dto';

export class TimeSlotAAStatsDTO {
  constructor(defaultValues: Partial<TimeSlotAAStatsDTO> = {}) {
    if (defaultValues == null) return;
    this.attended = defaultValues.attended;
    this.absented = defaultValues.absented;
  }

  @ApiProperty({ type: TimeSlotDTO, isArray: true })
  attended: TimeSlotDTO[];
  @ApiProperty({ type: TimeSlotDTO, isArray: true })
  absented: TimeSlotDTO[];
}
