import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleRepository } from 'src/modules/modules.repository';
import { TimeSlotRepository } from 'src/modules/timeslots/time-slots.repository';
import { AttendanceController } from './attendance.controller';
import { AttendanceRepository } from './attendance.repository';
import { AttendanceService } from './attendance.service';

@Module({
  controllers: [AttendanceController],
  imports: [
    TypeOrmModule.forFeature([ModuleRepository]),
    TypeOrmModule.forFeature([TimeSlotRepository]),
    TypeOrmModule.forFeature([AttendanceRepository]),
  ],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
