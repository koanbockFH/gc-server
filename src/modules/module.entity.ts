import { IsNotEmpty } from 'class-validator';
import { AuditEntity } from 'src/common/entity';
import { UserEntity } from 'src/users/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
export class ModuleEntity extends AuditEntity {
  constructor(defaultValues: Partial<ModuleEntity> = {}) {
    super(defaultValues);

    this.mapValues(defaultValues);
  }

  mapValues(defaultValues: Partial<ModuleEntity> = {}): void {
    if (defaultValues == null) return;
    this.id = defaultValues.id;
    this.name = defaultValues.name;
    this.code = defaultValues.code;
    this.description = defaultValues.description;
    this.teacherId = defaultValues.teacherId;
    this.teacher = defaultValues.teacher;
    this.students = defaultValues.students;
  }

  @Column()
  @IsNotEmpty()
  name!: string;

  @Column()
  @IsNotEmpty()
  code!: string;

  @Column({ default: '' })
  description!: string;

  @Column()
  teacherId!: number;

  @ManyToOne(() => UserEntity)
  teacher!: UserEntity;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  students!: UserEntity[];
}
