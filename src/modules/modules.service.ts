import { Injectable } from '@nestjs/common';
import { ModuleRepository } from './modules.repository';

@Injectable()
export class ModulesService {
  constructor(private moduleRepo: ModuleRepository) {}
}
