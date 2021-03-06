import { Injectable, NotFoundException } from '@nestjs/common';
import { AttendanceRepository } from 'src/attendance/attendance.repository';
import { ModuleRepository } from 'src/modules/modules.repository';
import { TimeSlotDTO } from 'src/modules/timeslots/dto/time-slots.dto';
import { TimeSlotRepository } from 'src/modules/timeslots/time-slots.repository';
import { UserDTO } from 'src/users/dto/user.dto';
import { UserEnum } from 'src/users/enum/user.enum';
import { UserEntity } from 'src/users/user.entity';
import { UserRepository } from 'src/users/users.repository';
import { StudentModuleStatsDTO } from './dto/student-module.stats.dto';
import { TeacherModuleStudentStatsDTO } from './dto/teacher-module-student.stats.dto';
import { TeacherModuleStatsDTO } from './dto/teacher-module.stats.dto';
import { TeacherStudentsStatsDTO } from './dto/teacher-students.stats.dto';
import { TeacherTimeSlotStatsDTO } from './dto/teacher-timeslot.stats.dto';
import { TimeSlotAAStatsDTO } from './dto/timeslot-aa.stats.dto';

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

  async getStatistics(user: UserEntity): Promise<StudentModuleStatsDTO[]> {
    const modules = await this.moduleRepo.getAll();
    const statisticModules: StudentModuleStatsDTO[] = [];
    await this.asyncForEach(modules, async module => {
      if (module.students.some(s => s.id == user.id) || user.userType == UserEnum.ADMIN) {
        const studentsTotal = module.students.length;
        const timeSlots = await this.timeSlotRepo.getAll(module.id);
        let studentsAttended = 0;
        await this.asyncForEach(timeSlots, async slot => {
          if (user.userType == UserEnum.ADMIN) {
            studentsAttended += (await this.attendanceRepo.findAndCount({ timeslotId: slot.id }))[1];
          } else {
            studentsAttended += (
              await this.attendanceRepo.findAndCount({ studentId: user.id, timeslotId: slot.id })
            )[1];
          }
        });
        let totalTimeslots = 0;
        timeSlots.forEach(slot => {
          if (slot.endDate.getTime() <= new Date().getTime()) {
            totalTimeslots++;
          }
        });
        statisticModules.push(
          new StudentModuleStatsDTO({
            ...module,
            totalTimeslots,
            totalStudents: studentsTotal,
            attended: studentsAttended,
            absent: studentsTotal - studentsAttended,
          }),
        );
      }
    });
    return statisticModules;
  }

  async getModuleStatistics(user: UserEntity, moduleId: number): Promise<TeacherModuleStudentStatsDTO> {
    const module = await this.moduleRepo.getById(moduleId);
    if (module.teacherId != user.id && user.userType != UserEnum.ADMIN) {
      throw new NotFoundException('There was no teaching module found.');
    }
    const studentsTotal = module.students.length;
    const timeSlots = await this.timeSlotRepo.getAll(module.id);
    const studentList = [];
    let studentsAttendedTotal = 0;
    let totalTimeslots = 0;
    timeSlots.forEach(slot => {
      if (slot.endDate.getTime() <= new Date().getTime()) {
        totalTimeslots++;
      }
    });
    await this.asyncForEach(module.students, async std => {
      const student = await this.userRepo.findOne(std.id);
      let attendedSlots = 0;
      await this.asyncForEach(timeSlots, async slot => {
        if (slot.endDate.getTime() <= new Date().getTime()) {
          attendedSlots += (await this.attendanceRepo.findAndCount({ timeslotId: slot.id, studentId: std.id }))[1];
        }
      });
      studentsAttendedTotal += attendedSlots;
      studentList.push(
        new TeacherStudentsStatsDTO({
          ...student,
          totalTimeslots,
          attended: attendedSlots,
          absent: totalTimeslots - attendedSlots,
        }),
      );
    });
    return new TeacherModuleStudentStatsDTO({
      ...module,
      teacher: new UserDTO(module.teacher),
      totalTimeslots,
      students: studentList,
      totalStudents: studentsTotal,
      attended: studentsAttendedTotal,
      absent: studentsTotal - studentsAttendedTotal,
    });
  }

  async getTimeslotsStatistics(user: UserEntity, moduleId: number): Promise<TeacherTimeSlotStatsDTO[]> {
    const module = await this.moduleRepo.getById(moduleId);
    if (module.teacherId != user.id && user.userType != UserEnum.ADMIN) {
      throw new NotFoundException('There was no teaching module found.');
    }
    const studentsTotal = module.students.length;
    const timeSlots = await this.timeSlotRepo.getAll(module.id);
    const timeSlotStats = [];
    await this.asyncForEach(timeSlots, async slot => {
      let studentsAttended = 0;
      await this.asyncForEach(module.students, async std => {
        studentsAttended += (await this.attendanceRepo.findAndCount({ studentId: std.id, timeslotId: slot.id }))[1];
      });
      timeSlotStats.push(
        new TeacherTimeSlotStatsDTO({
          ...slot,
          attended: studentsAttended,
          absent: studentsTotal - studentsAttended,
          totalStudents: studentsTotal,
        }),
      );
    });
    return timeSlotStats;
  }

  async getTimeSlotsAAA(user: UserEntity, moduleId: number, studentId: number): Promise<TimeSlotAAStatsDTO> {
    const module = await this.moduleRepo.getById(moduleId);
    if (module.teacherId != user.id && user.userType != UserEnum.ADMIN) {
      throw new NotFoundException('There was no teaching module found.');
    }
    const timeSlots = await this.timeSlotRepo.getAll(module.id);
    const attended = [];
    const absent = [];
    await this.asyncForEach(timeSlots, async slot => {
      if (slot.endDate.getTime() <= new Date().getTime()) {
        const checkAttendance = await this.attendanceRepo.find({ where: { studentId, timeslotId: slot.id } });
        if (checkAttendance.length > 0) {
          attended.push(new TimeSlotDTO(slot));
        } else {
          absent.push(new TimeSlotDTO(slot));
        }
      }
    });
    return new TimeSlotAAStatsDTO({
      attended,
      absent,
    });
  }

  async getTimeslotByIdStatistics(user: UserEntity, timeslotId: number): Promise<TeacherTimeSlotStatsDTO> {
    const timeSlot = await this.timeSlotRepo.getById(timeslotId);
    if (!timeSlot || (timeSlot.module.teacherId != user.id && user.userType != UserEnum.ADMIN)) {
      throw new NotFoundException('There was no timeslot found.');
    }
    const module = await this.moduleRepo.getById(timeSlot.moduleId);
    let studentsAttended = 0;
    const absentees = [];
    const attendees = [];
    await this.asyncForEach(module.students, async std => {
      const checkAttendance = await this.attendanceRepo.find({ where: { studentId: std.id, timeslotId: timeSlot.id } });
      if (checkAttendance.length > 0) {
        studentsAttended++;
        attendees.push(new UserDTO(std));
      } else {
        absentees.push(new UserDTO(std));
      }
    });
    const studentsTotal = module.students.length;
    delete timeSlot.module;
    delete timeSlot.moduleId;
    return new TeacherTimeSlotStatsDTO({
      ...timeSlot,
      attendees,
      absentees,
      totalStudents: studentsTotal,
      attended: studentsAttended,
      absent: studentsTotal - studentsAttended,
    });
  }

  async getStudentStatistics(studentId: number): Promise<TeacherModuleStatsDTO[]> {
    const modules = await this.moduleRepo.getAll();
    const asignedModules = [];
    const statisticModules: TeacherModuleStatsDTO[] = [];
    modules.forEach(module => {
      if (module.students.some(s => s.id == studentId)) {
        asignedModules.push(module);
      }
    });
    await this.asyncForEach(asignedModules, async module => {
      const timeSlots = await this.timeSlotRepo.getAll(module.id);
      let attendedSlots = 0;
      let totalTimeslots = 0;
      await this.asyncForEach(timeSlots, async slot => {
        if (slot.endDate.getTime() <= new Date().getTime()) {
          totalTimeslots++;
          attendedSlots += (await this.attendanceRepo.findAndCount({ studentId, timeslotId: slot.id }))[1];
        }
      });
      statisticModules.push(
        new TeacherModuleStatsDTO({
          ...module,
          teacher: new UserDTO(module.teacher),
          totalTimeslots,
          attended: attendedSlots,
          absent: totalTimeslots - attendedSlots,
        }),
      );
    });
    return statisticModules;
  }
}
