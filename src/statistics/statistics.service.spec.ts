import { Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getCustomRepositoryToken } from '@nestjs/typeorm';
import { AttendanceRepository } from 'src/attendance/attendance.repository';
import { ModuleRepository } from 'src/modules/modules.repository';
import { TimeSlotRepository } from 'src/modules/timeslots/time-slots.repository';
import { UserRepository } from 'src/users/users.repository';
import { StatisticsService } from './statistics.service';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let userRepo: UserRepository;
  let attendanceRepo: AttendanceRepository;
  let moduleRepo: ModuleRepository;
  let timeslotRepo: TimeSlotRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        { provide: getCustomRepositoryToken(UserRepository), useClass: UserRepository },
        { provide: getCustomRepositoryToken(AttendanceRepository), useClass: AttendanceRepository },
        { provide: getCustomRepositoryToken(ModuleRepository), useClass: ModuleRepository },
        { provide: getCustomRepositoryToken(TimeSlotRepository), useClass: TimeSlotRepository },
      ],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
    userRepo = module.get<UserRepository>(getCustomRepositoryToken(UserRepository));
    attendanceRepo = module.get<AttendanceRepository>(getCustomRepositoryToken(AttendanceRepository));
    moduleRepo = module.get<ModuleRepository>(getCustomRepositoryToken(ModuleRepository));
    timeslotRepo = module.get<TimeSlotRepository>(getCustomRepositoryToken(TimeSlotRepository));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('teacher view', () => {
    test('', () => {});
  });
});
