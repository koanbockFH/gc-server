import { AuditEntity } from 'src/common/entity';
import { Entity } from 'typeorm';

@Entity()
export class ModuleEntity extends AuditEntity {
  constructor(defaultValues: Partial<ModuleEntity> = {}) {
    super(defaultValues);

    if (defaultValues == null) return;
    this.id = defaultValues.id;
  }
}
