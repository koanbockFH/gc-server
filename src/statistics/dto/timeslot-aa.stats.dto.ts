import { ApiProperty } from '@nestjs/swagger';
import { TimeSlotDTO } from 'src/modules/timeslots/dto/time-slots.dto';

/**
 * Statistics of a timeslot and their student (from a teachers view - student data)
 */
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
