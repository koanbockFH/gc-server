import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceRepository } from 'src/attendance/attendance.repository';
import { ModuleRepository } from 'src/modules/modules.repository';
import { TimeSlotRepository } from 'src/modules/timeslots/time-slots.repository';
import { UserRepository } from 'src/users/users.repository';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService],
  imports: [
    TypeOrmModule.forFeature([ModuleRepository]),
    TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forFeature([TimeSlotRepository]),
    TypeOrmModule.forFeature([AttendanceRepository]),
  ],
})
export class StatisticsModule {}
