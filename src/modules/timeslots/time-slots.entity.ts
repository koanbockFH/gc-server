import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { AuditEntity } from 'src/common/entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ModuleEntity } from '../module.entity';

@Entity()
export class TimeSlotEntity extends AuditEntity {
  constructor(defaultValues: Partial<TimeSlotEntity> = {}) {
    super(defaultValues);

    this.mapValues(defaultValues);
  }

  mapValues(defaultValues: Partial<TimeSlotEntity> = {}): void {
    if (defaultValues == null) return;
    this.id = defaultValues.id;
    this.name = defaultValues.name;
    this.module = defaultValues.module;
    this.moduleId = defaultValues.moduleId;
    this.startDate = defaultValues.startDate;
    this.endDate = defaultValues.endDate;
  }

  @Column()
  @IsNotEmpty()
  name!: string;

  @Column()
  moduleId!: number;

  @ManyToOne(() => ModuleEntity)
  module!: ModuleEntity;

  @Column({
    type: 'int',
    nullable: true,
    default: () => null,
    transformer: {
      to: (value?: string): string | number | Date => (!value ? value : Math.round(new Date(value).getTime() / 1000)),
      from: (value?: number): Date | number => (!value ? value : new Date(value * 1000)),
    },
  })
  @Type(() => Date)
  @IsNotEmpty()
  startDate!: Date;

  @Column({
    type: 'int',
    nullable: true,
    default: () => null,
    transformer: {
      to: (value?: string): string | number | Date => (!value ? value : Math.round(new Date(value).getTime() / 1000)),
      from: (value?: number): Date | number => (!value ? value : new Date(value * 1000)),
    },
  })
  @Type(() => Date)
  @IsNotEmpty()
  endDate!: Date;
}
