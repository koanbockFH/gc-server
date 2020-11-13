import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTimeSlotDTO {
  constructor(defaultValues: Partial<CreateTimeSlotDTO> = {}) {
    this.mapValues(defaultValues);
  }

  mapValues(defaultValues: Partial<CreateTimeSlotDTO> = {}): void {
    if (defaultValues == null) return;
    this.name = defaultValues.name;
    this.startDate = defaultValues.startDate;
    this.endDate = defaultValues.endDate;
  }

  @ApiProperty()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ type: Date })
  startDate!: Date;

  @ApiProperty({ type: Date })
  endDate!: Date;
}
