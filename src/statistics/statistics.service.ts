import { Injectable, NotFoundException } from '@nestjs/common';
import { AttendanceRepository } from 'src/attendance/attendance.repository';
import { RequestWithUser } from 'src/auth/interfaces.interface';
import { ModuleRepository } from 'src/modules/modules.repository';
import { TimeSlotRepository } from 'src/modules/timeslots/time-slots.repository';
import { UserDTO } from 'src/users/dto/user.dto';
import { UserEnum } from 'src/users/enum/user.enum';
import { UserEntity } from 'src/users/user.entity';
import { UserRepository } from 'src/users/users.repository';
import { StudentModuleStatsDTO } from './dto/student-module.stats.dto';
import { TeacherAllTimeSlotsDTO } from './dto/teacher-all-timeslot-stats.dto';
import { TeacherModuleStudentStatsDTO } from './dto/teacher-module-student.stats.dto';
import { TeacherModuleStatsDTO } from './dto/teacher-module.stats.dto';
import { TeacherStudentsStatsDTO } from './dto/teacher-students.stats.dto';
import { TeacherTimeSlotStatsDTO } from './dto/teacher-timeslot.stats.dto';
import { UserStatisticsDTO } from './dto/user.stats.dto';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly moduleRepo: ModuleRepository,
    private readonly attendanceRepo: AttendanceRepository,
    private readonly timeSlotRepo: TimeSlotRepository,
  ) {}

  asyncForEach = async (
    arr: Array<any>,
    callback: (element: any, idx: number, arr: Array<any>) => any,
  ): Promise<void> => {
    for (let index = 0; index < arr.length; index++) {
      await callback(arr[index], index, arr);
    }
  };

  async getUserStatistics(id: number): Promise<UserStatisticsDTO> {
    const modules = await this.moduleRepo.getAll();
    const asignedModules = [];
    const statisticModules: StudentModuleStatsDTO[] = [];
    modules.forEach(module => {
      if (module.students.some(s => s.id == id)) {
        asignedModules.push(module);
      }
    });
    await this.asyncForEach(asignedModules, async module => {
      const studentsTotal = module.students.length;
      const timeSlots = await this.timeSlotRepo.getAll(module.id);
      let studentsAttended = 0;
      await this.asyncForEach(timeSlots, async slot => {
        studentsAttended += (await this.attendanceRepo.findAndCount({ timeslotId: slot.id }))[1];
      });
      statisticModules.push(
        new StudentModuleStatsDTO({
          ...module,
          classes: timeSlots.length,
          total: studentsTotal,
          attended: studentsAttended,
          absent: studentsTotal - studentsAttended,
        }),
      );
    });
    return new UserStatisticsDTO({ modules: statisticModules });
  }

  async getModuleStatistics(user: UserEntity, moduleId: number): Promise<TeacherModuleStudentStatsDTO> {
    const module = await this.moduleRepo.getById(moduleId);
    if (module.teacherId != user.id && user.userType != UserEnum.ADMIN) {
      throw new NotFoundException('There was no teaching module found.');
    }
    const studentsTotal = module.students.length;
    const timeSlots = await this.timeSlotRepo.getAll(module.id);
    const studentList = [];
    await this.asyncForEach(module.students, async std => {
      const student = await this.userRepo.findOne(std.id);
      let studentsAttended = 0;
      await this.asyncForEach(timeSlots, async slot => {
        studentsAttended += (await this.attendanceRepo.findAndCount({ timeslotId: slot.id, studentId: std.id }))[1];
      });
      studentList.push(
        new TeacherStudentsStatsDTO({
          ...student,
          total: studentsTotal,
          attended: studentsAttended,
          absent: studentsTotal - studentsAttended,
        }),
      );
    });
    return new TeacherModuleStudentStatsDTO({
      ...module,
      teacher: new UserDTO(module.teacher),
      classes: timeSlots.length,
      students: studentList,
    });
  }

  async getTimeslotsStatistics(user: UserEntity, moduleId: number): Promise<TeacherAllTimeSlotsDTO> {
    const module = await this.moduleRepo.getById(moduleId);
    if (module.teacherId != user.id && user.userType != UserEnum.ADMIN) {
      throw new NotFoundException('There was no teaching module found.');
    }
    const studentsTotal = module.students.length;
    const timeSlots = await this.timeSlotRepo.getAll(module.id);
    const timeSlotStats = [];
    await this.asyncForEach(timeSlots, async slot => {
      const studentsAttended = (await this.attendanceRepo.findAndCount({ timeslotId: slot.id }))[1];
      timeSlotStats.push(
        new TeacherTimeSlotStatsDTO({
          ...slot,
          attended: studentsAttended,
          absent: studentsTotal - studentsAttended,
          total: studentsTotal,
        }),
      );
    });
    return new TeacherAllTimeSlotsDTO({
      ...module,
      teacher: new UserDTO(module.teacher),
      timeSlots: timeSlotStats,
    });
  }

  async getTimeslotByIdStatistics(user: UserEntity, timeslotId: number): Promise<TeacherTimeSlotStatsDTO> {
    const timeSlot = await this.timeSlotRepo.getById(timeslotId);
    if (!timeSlot || (timeSlot.module.teacherId != user.id && user.userType != UserEnum.ADMIN)) {
      throw new NotFoundException('There was no timeslot found.');
    }
    const module = await this.moduleRepo.getById(timeSlot.moduleId);
    const studentsAttended = (await this.attendanceRepo.findAndCount({ timeslotId: timeSlot.id }))[1];
    const studentsTotal = module.students.length;
    delete timeSlot.module;
    delete timeSlot.moduleId;
    return new TeacherTimeSlotStatsDTO({
      ...timeSlot,
      total: studentsTotal,
      attended: studentsAttended,
      absent: studentsTotal - studentsAttended,
    });
  }

  async getStudentStatistics(user: UserEntity, studentId: number): Promise<UserStatisticsDTO> {
    const modules = await this.moduleRepo.getAll();
    const asignedModules = [];
    const statisticModules: TeacherModuleStatsDTO[] = [];
    modules.forEach(module => {
      if (
        (module.teacherId == user.id || user.userType == UserEnum.ADMIN) &&
        module.students.some(s => s.id == studentId)
      ) {
        asignedModules.push(module);
      }
    });
    await this.asyncForEach(asignedModules, async module => {
      const studentsTotal = module.students.length;
      const timeSlots = await this.timeSlotRepo.getAll(module.id);
      let studentsAttended = 0;
      await this.asyncForEach(timeSlots, async slot => {
        studentsAttended += (await this.attendanceRepo.findAndCount({ timeslotId: slot.id }))[1];
      });
      statisticModules.push(
        new TeacherModuleStatsDTO({
          ...module,
          teacher: new UserDTO(module.teacher),
          classes: timeSlots.length,
          total: studentsTotal,
          attended: studentsAttended,
          absent: studentsTotal - studentsAttended,
        }),
      );
    });
    return new UserStatisticsDTO({ modules: statisticModules });
  }

  async getModulesStatistics(): Promise<UserStatisticsDTO> {
    const modules = await this.moduleRepo.getAll();
    const statisticModules: StudentModuleStatsDTO[] = [];
    await this.asyncForEach(modules, async module => {
      const studentsTotal = module.students.length;
      const timeSlots = await this.timeSlotRepo.getAll(module.id);
      let studentsAttended = 0;
      await this.asyncForEach(timeSlots, async slot => {
        studentsAttended += (await this.attendanceRepo.findAndCount({ timeslotId: slot.id }))[1];
      });

      statisticModules.push(
        new StudentModuleStatsDTO({
          ...module,
          classes: timeSlots.length,
          total: studentsTotal,
          attended: studentsAttended,
          absent: studentsTotal - studentsAttended,
        }),
      );
    });
    return new UserStatisticsDTO({ modules: statisticModules });
  }
}
