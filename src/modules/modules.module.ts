import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulesController } from './modules.controller';
import { ModuleRepository } from './modules.repository';
import { ModulesService } from './modules.service';

@Module({
  controllers: [ModulesController],
  imports: [TypeOrmModule.forFeature([ModuleRepository])],
  providers: [ModulesService],
  exports: [ModulesService],
})
export class ModulesModule {}
