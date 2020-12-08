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

  /**
   * records the attendance of a student if he is part of the class
   * @param timeslotId timeslot id
   * @param studentCode studentcode - not the id
   */
  async checkIn(timeslotId: number, studentCode: string): Promise<void> {
    const student = await this.userRepo.findOne({ code: studentCode });
    if (!student) {
      throw new NotFoundException('There is no student with that code!');
    }
    const studentId = student.id;
    const entity = new AttendanceEntity({ timeslotId, studentId });
    const timeSlot = await this.timeSlotRepo.getById(timeslotId);
    if (!timeSlot) {
      throw new NotFoundException('Cannot find that timeslot.');
    }
    const module = await this.moduleRepo.getById(timeSlot.moduleId);
    if (!module.students.some(std => std.code == studentCode)) {
      throw new HttpException('Student not part of the classlist!', HttpStatus.CONFLICT);
    }
    await this.attendanceRepo.saveOrUpdate(entity);
  }
}
