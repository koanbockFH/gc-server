import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserDTO } from 'src/users/dto/user.dto';

export class ModuleDTO {
  constructor(defaultValues: Partial<ModuleDTO> = {}) {
    this.mapValues(defaultValues);
  }

  mapValues(defaultValues: Partial<ModuleDTO> = {}): void {
    if (defaultValues == null) return;
    this.id = defaultValues.id;
    this.name = defaultValues.name;
    this.code = defaultValues.code;
    this.description = defaultValues.description;
    this.teacherId = defaultValues.teacherId;
    this.teacher = defaultValues.teacher;
    this.students = defaultValues.students;
  }

  @ApiProperty()
  id!: number;

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

  @ApiProperty()
  teacher!: UserDTO;

  @ApiProperty()
  students!: UserDTO[];
}
