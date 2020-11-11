import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateModuleDTO {
  constructor(defaultValues: Partial<CreateModuleDTO> = {}) {
    this.mapValues(defaultValues);
  }

  mapValues(defaultValues: Partial<CreateModuleDTO> = {}): void {
    if (defaultValues == null) return;
    this.name = defaultValues.name;
    this.code = defaultValues.code;
    this.description = defaultValues.description;
    this.teacherId = defaultValues.teacherId;
  }

  @ApiProperty()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsNotEmpty()
  code!: string;

  @ApiProperty()
  @IsNotEmpty()
  description!: string;

  @ApiProperty()
  teacherId!: number;

  @ApiProperty({ type: 'number', isArray: true })
  studentIds!: number[];
}
