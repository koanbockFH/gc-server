import { Type } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, PrimaryGeneratedColumn } from 'typeorm';

/**
 * basic entity structure, with audit entries for later analysis of service usage
 */
export abstract class BaseEntity {
  constructor(defaultValues: Partial<BaseEntity> = {}) {
    if (defaultValues == null) return;

    this.id = defaultValues.id;
  }

  @PrimaryGeneratedColumn()
  id!: number;
}

export abstract class AuditEntity extends BaseEntity {
  constructor(defaultValues: Partial<AuditEntity> = {}) {
    super(defaultValues);

    if (defaultValues == null) return;

    this.createdAt = defaultValues.createdAt;
    this.updatedAt = defaultValues.updatedAt;
  }

  @Column({
    type: 'int',
    nullable: true,
    default: () => null,
    transformer: {
      to: (value?: Date): Date | number => (!value ? value : Math.round(value.getTime() / 1000)),
      from: (value?: number): Date | number => (!value ? value : new Date(value * 1000)),
    },
  })
  @Type(() => Date)
  createdAt: Date;

  @Column({
    type: 'int',
    nullable: true,
    default: () => null,
    transformer: {
      to: (value?: Date): Date | number => (!value ? value : Math.round(value.getTime() / 1000)),
      from: (value?: number): Date | number => (!value ? value : new Date(value * 1000)),
    },
  })
  @Type(() => Date)
  updatedAt?: Date;

  @BeforeInsert()
  updateDateCreation(): void {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  updateDateUpdate(): void {
    this.updatedAt = new Date();
  }
}
