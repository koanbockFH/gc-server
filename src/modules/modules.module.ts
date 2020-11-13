import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/users.repository';
import { ModulesController } from './modules.controller';
import { ModuleRepository } from './modules.repository';
import { ModulesService } from './modules.service';
import { TimeSlotRepository } from './timeslots/time-slots.repository';
import { TimeSlotsService } from './timeslots/time-slots.service';

@Module({
  controllers: [ModulesController],
  imports: [
    TypeOrmModule.forFeature([ModuleRepository]),
    TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forFeature([TimeSlotRepository]),
  ],
  providers: [ModulesService, TimeSlotsService],
  exports: [ModulesService, TimeSlotsService],
})
export class ModulesModule {}
