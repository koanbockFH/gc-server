import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ModuleRepository } from 'src/modules/modules.repository';
import { TimeSlotRepository } from 'src/modules/timeslots/time-slots.repository';
import { UserRepository } from 'src/users/users.repository';
import { AttendanceEntity } from './attendance.entity';
import { AttendanceRepository } from './attendance.repository';

@Injectable()
export class AttendanceService {
  constructor(
    private attendanceRepo: AttendanceRepository,
    private timeSlotRepo: TimeSlotRepository,
    private moduleRepo: ModuleRepository,
    private userRepo: UserRepository,
  ) {}

  async checkIn(timeslotId: number, studentCode: string): Promise<void> {
    const student = await this.userRepo.findOne({ code: studentCode });
    if (!student) {
      throw new NotFoundException({ studentExists: false });
    }
    const studentId = student.id;
    const entity = new AttendanceEntity({ timeslotId, studentId });
    const timeSlot = await this.timeSlotRepo.getById(timeslotId);
    if (!timeSlot) {
      throw new NotFoundException('There was no timeslot found.');
    }
    const module = await this.moduleRepo.getById(timeSlot.moduleId);
    if (!module.students.some(std => std.code == studentCode)) {
      throw new HttpException('Student is not allowed to attend.', HttpStatus.CONFLICT);
    }
    await this.attendanceRepo.saveOrUpdate(entity);
  }
}
