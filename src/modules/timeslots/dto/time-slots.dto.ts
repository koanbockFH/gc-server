import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

/**
 * TimeSlot dto used for responses and editing
 */
export class TimeSlotDTO {
  constructor(defaultValues: Partial<TimeSlotDTO> = {}) {
    this.mapValues(defaultValues);
  }

  mapValues(defaultValues: Partial<TimeSlotDTO> = {}): void {
    if (defaultValues == null) return;
    this.id = defaultValues.id;
    this.name = defaultValues.name;
    this.startDate = defaultValues.startDate;
    this.endDate = defaultValues.endDate;
  }

  @ApiProperty()
  id!: number;

  @ApiProperty()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ type: Date })
  startDate!: Date;

  @ApiProperty({ type: Date })
  endDate!: Date;
}
