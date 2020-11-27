import { Injectable, NotFoundException } from '@nestjs/common';
import { AttendanceRepository } from 'src/attendance/attendance.repository';
import { ModuleRepository } from 'src/modules/modules.repository';
import { TimeSlotRepository } from 'src/modules/timeslots/time-slots.repository';
import { UserEntity } from 'src/users/user.entity';
import { UserRepository } from 'src/users/users.repository';
import { TeacherAllTimeSlotsDTO } from './dto/teacher-all-timeslot-stats.dto';
import { TeacherModuleStatsDTO } from './dto/teacher-module.stats.dto';
import { TeacherTimeSlotStatsDTO } from './dto/teacher-timeslot.stats.dto';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly moduleRepo: ModuleRepository,
    private readonly attendanceRepo: AttendanceRepository,
    private readonly timeSlotRepo: TimeSlotRepository,
  ) {}

  async getUserStatistics(id: number): Promise<void> {
    // wait for attendance calls endpoint
  }

  async getModuleStatistics(userId: number, moduleId: number): Promise<TeacherModuleStatsDTO> {
    // wait for attendance calls endpoint
    const module = await this.moduleRepo.getById(moduleId);
    if (module.teacherId != userId) {
      throw new NotFoundException('There was no teaching module found.');
    }
    const studentsTotal = module.students.length;
    const timeSlots = await this.timeSlotRepo.getAll(module.id);
    let studentsAttended = 0;
    timeSlots.forEach(async slot => {
      studentsAttended += (await this.attendanceRepo.findAndCount({ timeslotId: slot.id }))[1];
    });
    return new TeacherModuleStatsDTO({
      ...module,
      teacher: new UserEntity(module.teacher),
      classes: timeSlots.length,
      total: studentsTotal,
      attended: studentsAttended,
      absent: studentsTotal - studentsAttended,
    });
  }

  async getTimeslotsStatistics(userId: number, moduleId: number): Promise<TeacherAllTimeSlotsDTO> {
    // wait for attendance calls endpoint
    const module = await this.moduleRepo.getById(moduleId);
    if (module.teacherId != userId) {
      throw new NotFoundException('There was no teaching module found.');
    }
    const studentsTotal = module.students.length;
    const timeSlots = await this.timeSlotRepo.getAll(module.id);
    const timeSlotStats = [];
    timeSlots.forEach(async slot => {
      const studentsAttended = (await this.attendanceRepo.findAndCount({ timeslotId: slot.id }))[1];
      timeSlotStats.push({
        ...slot,
        attended: studentsAttended,
        absent: studentsTotal - studentsAttended,
        total: studentsTotal,
      });
    });
    return new TeacherAllTimeSlotsDTO({
      ...module,
      teacher: new UserEntity(module.teacher),
      timeSlots: timeSlotStats,
    });
  }

  async getTimeslotByIdStatistics(userId: number, timeslotId: number): Promise<TeacherTimeSlotStatsDTO> {
    // wait for attendance calls endpoint
    const timeSlot = await this.timeSlotRepo.getById(timeslotId);
    let module = null;
    if (
      !timeSlot ||
      !(module = await this.moduleRepo.findOne({
        where: { moduleId: timeSlot.moduleId, teacherId: userId },
        relations: ['teacher', 'students'],
      }))
    ) {
      throw new NotFoundException('There was no timeslot found.');
    }
    const studentsAttended = (await this.attendanceRepo.findAndCount({ timeslotId: timeSlot.id }))[1];
    const studentsTotal = module.students.length;
    return new TeacherTimeSlotStatsDTO({
      ...timeSlot,
      total: studentsTotal,
      attended: studentsAttended,
      absent: studentsTotal - studentsAttended,
    });
  }

  async getStudentStatistics(userId: number, studentId: number): Promise<void> {
    // wait for attendance calls endpoint
  }

  async getModulesStatistics(userId: number): Promise<void> {
    // wait for attendance calls endpoint
  }
}
