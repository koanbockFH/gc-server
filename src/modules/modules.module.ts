import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/users.repository';
import { ModulesController } from './modules.controller';
import { ModuleRepository } from './modules.repository';
import { ModulesService } from './modules.service';

@Module({
  controllers: [ModulesController],
  imports: [TypeOrmModule.forFeature([ModuleRepository]), TypeOrmModule.forFeature([UserRepository])],
  providers: [ModulesService],
  exports: [ModulesService],
})
export class ModulesModule {}
