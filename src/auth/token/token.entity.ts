import { IsNotEmpty } from 'class-validator';
import { AuditEntity } from 'src/common/entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class TokenEntity extends AuditEntity {
  constructor(defaultValues: Partial<TokenEntity> = {}) {
    super(defaultValues);

    this.mapValues(defaultValues);
  }

  mapValues(defaultValues: Partial<TokenEntity> = {}): void {
    if (defaultValues == null) return;
    this.id = defaultValues.id;
    this.token = defaultValues.token;
  }

  @Column()
  @IsNotEmpty()
  token!: string;
}
