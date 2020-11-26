import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceController } from './attendance.controller';
import { AttendanceRepository } from './attendance.repository';
import { AttendanceService } from './attendance.service';

@Module({
  controllers: [AttendanceController],
  imports: [TypeOrmModule.forFeature([AttendanceRepository])],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
