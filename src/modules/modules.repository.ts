import { EntityRepository, Repository } from 'typeorm';
import { ModuleEntity } from './module.entity';

@EntityRepository(ModuleEntity)
export class ModuleRepository extends Repository<ModuleEntity> {}
