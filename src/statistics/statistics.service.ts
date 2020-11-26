import { Injectable } from '@nestjs/common';
import { AttendanceRepository } from 'src/attendance/attendance.repository';
import { ModuleRepository } from 'src/modules/modules.repository';
import { UserRepository } from 'src/users/users.repository';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly moduleRepo: ModuleRepository,
    private readonly attendanceRepo: AttendanceRepository,
  ) {}
  async getUserStatistics(id: number): Promise<void> {
    // wait for attendance calls endpoint
  }

  async getModuleStatistics(userId: number, moduleId: number): Promise<void> {
    // wait for attendance calls endpoint
  }

  async getTimeslotsStatistics(userId: number, moduleId: number): Promise<void> {
    // wait for attendance calls endpoint
  }

  async getTimeslotByIdStatistics(userId: number, timeslotId: number): Promise<void> {
    // wait for attendance calls endpoint
  }

  async getStudentStatistics(userId: number, studentId: number): Promise<void> {
    // wait for attendance calls endpoint
  }

  async getModulesStatistics(userId: number): Promise<void> {
    // wait for attendance calls endpoint
  }
}
