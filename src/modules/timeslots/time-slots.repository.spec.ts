import { validate, ValidationError } from 'class-validator';
import { UserEnum } from 'src/users/enum/user.enum';
import { UserEntity } from 'src/users/user.entity';
import { UserRepository } from 'src/users/users.repository';
import { createConnection, getConnection, getCustomRepository } from 'typeorm';
import { ModuleEntity } from '../module.entity';
import { ModuleRepository } from '../modules.repository';
import { TimeSlotEntity } from './time-slots.entity';
import { TimeSlotRepository } from './time-slots.repository';

describe('TimeSlotRepository', () => {
  beforeEach(() => {
    return createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [TimeSlotEntity, ModuleEntity, UserEntity],
      synchronize: true,
      logging: false,
    });
  });

  afterEach(() => {
    const conn = getConnection();
    return conn.close();
  });

  async function initRepository(): Promise<TimeSlotRepository> {
    const timeSlotRepository = getCustomRepository(TimeSlotRepository);
    const moduleRepository = getCustomRepository(ModuleRepository);
    const userRepository = getCustomRepository(UserRepository);
    const teacher = new UserEntity({
      id: 1,
      firstName: 'Some Teacher',
      lastName: 'A Teacher',
      code: 'D123',
      password: 'SomeHash',
      mail: 'user3@example.com',
      userType: UserEnum.TEACHER,
    });
    const student_1 = new UserEntity({
      id: 2,
      firstName: 'Some Student',
      lastName: 'Max',
      code: 'D234',
      password: 'SomeHash',
      mail: 'user4@example.com',
      userType: UserEnum.STUDENT,
    });
    const student_2 = new UserEntity({
      id: 3,
      firstName: 'Student_2',
      lastName: 'Smith',
      code: 'D345',
      password: 'SomeHash',
      mail: 'user5@example.com',
      userType: UserEnum.STUDENT,
    });

    await userRepository.save(teacher);
    await userRepository.save(student_1);
    await userRepository.save(student_2);

    const module_1 = new ModuleEntity({
      id: 1,
      code: '123',
      description: 'Some description',
      name: 'Global Classroom',
      teacher: teacher,
      students: [student_2, student_1],
    });

    const module_2 = new ModuleEntity({
      id: 2,
      code: '123',
      description: 'Some description',
      name: 'Global Classroom',
      teacher: teacher,
      students: [student_2],
    });
    await moduleRepository.save(module_1);
    await moduleRepository.save(module_2);

    const timeSlot_1 = new TimeSlotEntity({
      id: 1,
      name: 'Some TimeSlot',
      startDate: new Date(),
      endDate: new Date(),
      module: module_1,
    });
    const timeSlot_2 = new TimeSlotEntity({
      id: 2,
      name: 'Some TimeSlot 2',
      startDate: new Date(),
      endDate: new Date(),
      module: module_1,
    });
    const timeSlot_3 = new TimeSlotEntity({
      id: 3,
      name: 'Some TimeSlot 3',
      startDate: new Date(),
      endDate: new Date(),
      module: module_2,
    });

    await timeSlotRepository.save(timeSlot_1);
    await timeSlotRepository.save(timeSlot_2);
    await timeSlotRepository.save(timeSlot_3);

    return timeSlotRepository;
  }

  async function getDummyStudent(): Promise<UserEntity> {
    const userRepository = getCustomRepository(UserRepository);
    const user = new UserEntity({
      firstName: 'Some Student 1',
      lastName: 'Maxi',
      code: 'D4561',
      password: 'SomeHash1',
      mail: 'user1@example.com',
      userType: UserEnum.STUDENT,
    });

    await userRepository.insert(user);
    return user;
  }

  async function getDummyTeacher(): Promise<UserEntity> {
    const userRepository = getCustomRepository(UserRepository);
    const user = new UserEntity({
      firstName: 'Some Teacher 2',
      lastName: 'Max',
      code: 'D5672',
      password: 'SomeHas2h',
      mail: 'user2@example.com',
      userType: UserEnum.TEACHER,
    });

    await userRepository.insert(user);
    return user;
  }

  async function getDummyModule(teacher: UserEntity, student: UserEntity, single = false): Promise<ModuleEntity> {
    const moduleRepository = getCustomRepository(ModuleRepository);
    const timeSlotRepository = getCustomRepository(TimeSlotRepository);
    const module = new ModuleEntity({
      code: '123',
      description: 'Some description',
      name: 'Global Classroom',
      teacher: teacher,
      students: [student],
    });

    await moduleRepository.insert(module);
    if (!single) {
      const timeSlot = new TimeSlotEntity({
        name: 'Morning',
        startDate: new Date(),
        endDate: new Date(),
        module: module,
        moduleId: 1,
      });
      const timeSlot_2 = new TimeSlotEntity({
        name: 'Afternoon',
        startDate: new Date(),
        endDate: new Date(),
        module: module,
        moduleId: 1,
      });

      await timeSlotRepository.insert(timeSlot);
      await timeSlotRepository.insert(timeSlot_2);
    }
    return module;
  }

  describe('getById', () => {
    test('successfull retrieval', async () => {
      const timeSlotRepository = await initRepository();
      const actual = await timeSlotRepository.getById(1);

      expect(actual.name).toBe('Some TimeSlot');
      expect(actual.module.code).toBe('123');
      expect(actual.startDate).toBeDefined();
      expect(actual.endDate).toBeDefined();
    });

    test('failed retrieval - no item found - null value', async () => {
      const timeSlotRepository = await initRepository();
      await expect(timeSlotRepository.getById(99)).resolves.toBeNull();
    });
  });

  describe('getAll', () => {
    test('successfull retrieval', async () => {
      const timeSlotRepository = await initRepository();

      const student = await getDummyStudent();
      const teacher = await getDummyTeacher();
      const dummyModule = await getDummyModule(teacher, student);

      const actual = await timeSlotRepository.getAll(dummyModule.id);

      expect(actual).toHaveLength(2);
      expect(actual[0].name).toBe('Morning');
      expect(actual[0].moduleId).toBe(dummyModule.id);
    });
  });

  describe('SaveOrUpdate', () => {
    test('Save new Item', async () => {
      const timeSlotRepository = getCustomRepository(TimeSlotRepository);

      const student = await getDummyStudent();
      const teacher = await getDummyTeacher();
      const module = await getDummyModule(teacher, student, true);
      const timeSlot = new TimeSlotEntity({
        name: 'Evening',
        startDate: new Date(),
        endDate: new Date(),
        module: module,
        moduleId: 1,
      });

      await timeSlotRepository.saveOrUpdate(timeSlot);

      const actual = await timeSlotRepository.findOne(1, { relations: ['module'] });
      expect(actual.name).toBe(timeSlot.name);
      expect(actual.moduleId).toBe(module.id);
    });

    test('update existing Item', async () => {
      const timeSlotRepository = await initRepository();
      const timeSlot = await timeSlotRepository.findOne({ relations: ['module'] });
      expect(timeSlot.name).toBe('Some TimeSlot');
      timeSlot.name = 'Some morning TimeSlot';

      await timeSlotRepository.saveOrUpdate(timeSlot);

      const actual = await timeSlotRepository.findOne({ id: timeSlot.id });
      expect(actual.name).toBe(timeSlot.name);
    });

    test('fail validation on save or update', async () => {
      const timeSlotRepository = getCustomRepository(TimeSlotRepository);
      const timeSlot = new TimeSlotEntity();

      expect((await validate(timeSlot)).length).toBeGreaterThan(0);

      try {
        await timeSlotRepository.saveOrUpdate(timeSlot);
      } catch (e) {
        if (Array.isArray(e) && e[0] instanceof ValidationError) {
          expect(e.find((error: ValidationError) => error.property == 'name')).toBeInstanceOf(ValidationError);
          expect(e.find((error: ValidationError) => error.property == 'startDate')).toBeInstanceOf(ValidationError);
          expect(e.find((error: ValidationError) => error.property == 'endDate')).toBeInstanceOf(ValidationError);
          expect(e).toHaveLength(3);
        } else {
          fail('This should not have happened: ' + e);
        }
      }

      await expect(timeSlotRepository.find()).resolves.toHaveLength(0);
    });
  });
});
