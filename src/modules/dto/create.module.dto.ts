import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserDTO } from 'src/users/dto/user.dto';

/**
 * Module dto used for creating a new module
 */
export class CreateModuleDTO {
  constructor(defaultValues: Partial<CreateModuleDTO> = {}) {
    this.mapValues(defaultValues);
  }

  mapValues(defaultValues: Partial<CreateModuleDTO> = {}): void {
    if (defaultValues == null) return;
    this.name = defaultValues.name;
    this.code = defaultValues.code;
    this.description = defaultValues.description;
    this.teacher = defaultValues.teacher;
    this.students = defaultValues.students;
  }

  @ApiProperty()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsNotEmpty()
  code!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  teacher!: UserDTO;

  @ApiProperty({ type: () => UserDTO, isArray: true })
  students!: UserDTO[];
}
