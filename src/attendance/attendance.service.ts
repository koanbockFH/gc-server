import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ModuleRepository } from 'src/modules/modules.repository';
import { TimeSlotRepository } from 'src/modules/timeslots/time-slots.repository';
import { AttendanceEntity } from './attendance.entity';
import { AttendanceRepository } from './attendance.repository';

@Injectable()
export class AttendanceService {
  constructor(
    private attendanceRepo: AttendanceRepository,
    private timeSlotRepo: TimeSlotRepository,
    private moduleRepo: ModuleRepository,
  ) {}

  async checkIn(timeslotId: number, studentId: number): Promise<void> {
    const entity = new AttendanceEntity({ timeslotId, studentId });
    const timeSlot = await this.timeSlotRepo.getById(timeslotId);
    if (!timeSlot) {
      throw new NotFoundException('There was no timeslot found.');
    }
    const module = await this.moduleRepo.getById(timeSlot.moduleId);
    if (!module.students.some(std => std.id == studentId)) {
      throw new HttpException('Student is not allowed to attend.', HttpStatus.CONFLICT);
    }
    await this.attendanceRepo.saveOrUpdate(entity);
  }
}
