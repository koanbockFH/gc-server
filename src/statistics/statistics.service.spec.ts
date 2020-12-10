import { Test, TestingModule } from '@nestjs/testing';
import { getCustomRepositoryToken } from '@nestjs/typeorm';
import { AttendanceEntity } from 'src/attendance/attendance.entity';
import { AttendanceRepository } from 'src/attendance/attendance.repository';
import { ModuleEntity } from 'src/modules/module.entity';
import { ModuleRepository } from 'src/modules/modules.repository';
import { TimeSlotEntity } from 'src/modules/timeslots/time-slots.entity';
import { TimeSlotRepository } from 'src/modules/timeslots/time-slots.repository';
import { UserEnum } from 'src/users/enum/user.enum';
import { UserEntity } from 'src/users/user.entity';
import { UserRepository } from 'src/users/users.repository';
import { StudentModuleStatsDTO } from './dto/student-module.stats.dto';
import { TeacherModuleStudentStatsDTO } from './dto/teacher-module-student.stats.dto';
import { TeacherModuleStatsDTO } from './dto/teacher-module.stats.dto';
import { TeacherTimeSlotStatsDTO } from './dto/teacher-timeslot.stats.dto';
import { TimeSlotAAStatsDTO } from './dto/timeslot-aa.stats.dto';
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

  async function populateMockupDatabase() {
    userRepo.saveOrUpdate = jest.fn();
    moduleRepo.saveOrUpdate = jest.fn();
    timeslotRepo.saveOrUpdate = jest.fn();
    attendanceRepo.saveOrUpdate = jest.fn();
    const user = new UserEntity({
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      code: 'A001',
      userType: UserEnum.ADMIN,
      password: 'SomeHash',
      mail: 'user@example.com',
    });

    await userRepo.saveOrUpdate(user);

    for (let i = 1; i <= 50; i++) {
      const teacher = new UserEntity({
        firstName: i.toString(),
        lastName: (i * 1000).toString(),
        code: 'T00' + i.toString(),
        userType: UserEnum.TEACHER,
        password: 'SomeHash',
        mail: (i * 1000).toString() + 't@example.com',
      });

      await userRepo.saveOrUpdate(teacher);
    }
    const students = [];
    for (let i = 1; i <= 50; i++) {
      const student = new UserEntity({
        firstName: i.toString(),
        lastName: (i * 1000).toString(),
        code: 'S00' + i.toString(),
        userType: UserEnum.STUDENT,
        password: 'SomeHash',
        mail: (i * 1000).toString() + 's@example.com',
      });

      await userRepo.saveOrUpdate(student);
      students.push(student);
    }
    for (let i = 0; i <= 40; i++) {
      const module = new ModuleEntity({
        code: 'MO' + (i * 100).toString(),
        name: 'Module' + i,
        description: '',
        teacherId: 4,
        students: [students[i]],
      });

      await moduleRepo.saveOrUpdate(module);
    }

    for (let i = 0; i < 20; i++) {
      const randomDateFnc = (start, end) => {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      };
      const randomDate = randomDateFnc(new Date(2020, 1, 1), new Date());
      const endDate = new Date(randomDate.getTime() + 60 * 1000);
      const timeslot = new TimeSlotEntity({
        name: 'Lecture ' + i,
        moduleId: i,
        startDate: randomDate,
        endDate: endDate,
      });
      await timeslotRepo.saveOrUpdate(timeslot);
    }

    for (let i = 0; i < 10; i++) {
      const attendance = new AttendanceEntity({
        studentId: i + 1,
        timeslotId: i,
      });
      await attendanceRepo.saveOrUpdate(attendance);
    }
  }

  async function getLoggedInAdmin() {
    return new UserEntity({
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      code: 'A001',
      userType: UserEnum.ADMIN,
      password: 'SomeHash',
      mail: 'user@example.com',
    });
  }
  async function getLoggedInTeacher() {
    return new UserEntity({
      id: 40,
      firstName: 'Jake',
      lastName: 'Smith',
      code: 'T001',
      userType: UserEnum.TEACHER,
      password: 'SomeHash',
      mail: 'user@example.com',
    });
  }
  describe('teacher view', () => {
    test('stats of specific student', async () => {
      await populateMockupDatabase();
      const teacher = await getLoggedInTeacher();
      service.getStudentStatistics = jest.fn().mockReturnValueOnce([new TeacherModuleStatsDTO()]);
      expect(await service.getStudentStatistics(teacher, 1)).toHaveLength(1);
    });

    test('stats of specific module', async () => {
      await populateMockupDatabase();
      const teacher = await getLoggedInTeacher();
      service.getModuleStatistics = jest.fn().mockReturnValueOnce(new TeacherModuleStudentStatsDTO({ attended: 1 }));
      expect(await (await service.getModuleStatistics(teacher, 1)).attended).toBe(1);
    });

    test('stats of timeslots of specific module', async () => {
      await populateMockupDatabase();
      const teacher = await getLoggedInTeacher();
      service.getTimeslotsStatistics = jest.fn().mockReturnValueOnce([new TeacherTimeSlotStatsDTO()]);
      expect(await service.getTimeslotsStatistics(teacher, 1)).toHaveLength(1);
    });
    test('stats of timeslots of specific student', async () => {
      await populateMockupDatabase();
      const teacher = await getLoggedInTeacher();
      service.getTimeSlotsAAA = jest.fn().mockReturnValueOnce([new TimeSlotAAStatsDTO()]);
      expect(await service.getTimeSlotsAAA(teacher, 1, 1)).toHaveLength(1);
    });
  });

  describe('admin view', () => {
    test('statistics of all users', async () => {
      await populateMockupDatabase();
      const admin = await getLoggedInAdmin();
      service.getStatistics = jest.fn().mockReturnValueOnce([new StudentModuleStatsDTO()]);
      expect(await service.getStatistics(admin)).toHaveLength(1);
    });
  });
});
