import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CheckInDTO {
  constructor(defaultValues: Partial<CheckInDTO> = {}) {
    this.mapValues(defaultValues);
  }

  mapValues(defaultValues: Partial<CheckInDTO> = {}): void {
    if (defaultValues == null) return;
    this.studentId = defaultValues.studentId;
    this.timeslotId = defaultValues.timeslotId;
  }

  @ApiProperty()
  @IsNotEmpty()
  studentId!: number;

  @ApiProperty()
  @IsNotEmpty()
  timeslotId!: number;
}
