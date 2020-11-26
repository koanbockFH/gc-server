import { Injectable } from '@nestjs/common';
import { AttendanceEntity } from './attendance.entity';
import { AttendanceRepository } from './attendance.repository';

@Injectable()
export class AttendanceService {
  constructor(private attendanceRepo: AttendanceRepository) {}

  async checkIn(timeslotId: number, studentId: number): Promise<void> {
    const entity = new AttendanceEntity({ timeslotId, studentId });
    await this.attendanceRepo.saveOrUpdate(entity);
  }
}
