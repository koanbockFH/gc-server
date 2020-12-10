import { validate, ValidationError } from 'class-validator';
import { UserEnum } from 'src/users/enum/user.enum';
import { UserEntity } from 'src/users/user.entity';
import { UserRepository } from 'src/users/users.repository';
import { createConnection, getConnection, getCustomRepository } from 'typeorm';
import { ModuleEntity } from './module.entity';
import { ModuleRepository } from './modules.repository';

describe('ModuleRepository', () => {
  beforeEach(() => {
    return createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [ModuleEntity, UserEntity],
      synchronize: true,
      logging: false,
    });
  });

  afterEach(() => {
    const conn = getConnection();
    return conn.close();
  });

  async function initRepository(): Promise<ModuleRepository> {
    const moduleRepository = getCustomRepository(ModuleRepository);
    const userRepository = getCustomRepository(UserRepository);
    const teacher = new UserEntity({
      id: 1,
      firstName: 'Some Teacher',
      lastName: 'A Teacher',
      code: 'D123',
      password: 'SomeHash',
      mail: 'user1@example.com',
      userType: UserEnum.TEACHER,
    });
    const student_1 = new UserEntity({
      id: 2,
      firstName: 'Some Student',
      lastName: 'Max',
      code: 'D234',
      password: 'SomeHash',
      mail: 'user2@example.com',
      userType: UserEnum.STUDENT,
    });
    const student_2 = new UserEntity({
      id: 3,
      firstName: 'Student_2',
      lastName: 'Smith',
      code: 'D345',
      password: 'SomeHash',
      mail: 'user3@example.com',
      userType: UserEnum.STUDENT,
    });

    await userRepository.save(teacher);
    await userRepository.save(student_1);
    await userRepository.save(student_2);

    const module = new ModuleEntity({
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

    await moduleRepository.save(module);
    await moduleRepository.save(module_2);

    return moduleRepository;
  }

  async function getDummyStudent(): Promise<UserEntity> {
    const userRepository = getCustomRepository(UserRepository);
    const user = new UserEntity({
      firstName: 'Some Student',
      lastName: 'Max',
      code: 'D456',
      password: 'SomeHash',
      mail: 'user1@example.com',
      userType: UserEnum.STUDENT,
    });

    await userRepository.insert(user);
    return user;
  }

  async function getDummyTeacher(): Promise<UserEntity> {
    const userRepository = getCustomRepository(UserRepository);
    const user = new UserEntity({
      firstName: 'Some Teacher',
      lastName: 'Max',
      code: 'D567',
      password: 'SomeHash',
      mail: 'user2@example.com',
      userType: UserEnum.TEACHER,
    });

    await userRepository.insert(user);
    return user;
  }

  describe('getById', () => {
    test('successfull retrieval', async () => {
      const moduleRepository = await initRepository();
      const actual = await moduleRepository.getById(1);

      expect(actual.code).toBe('123');
      expect(actual.teacher.firstName).toBe('Some Teacher');
      expect(actual.students).toHaveLength(2);
      expect(actual.students[0].firstName).toBe('Some Student');
      expect(actual.teacherId).toBe(1);
    });

    test('failed retrieval - no item found - null value', async () => {
      const serverRepository = await initRepository();
      await expect(serverRepository.getById(99)).resolves.toBeNull();
    });
  });

  describe('getAll', () => {
    test('All for Admin', async () => {
      const moduleRepository = await initRepository();
      const actual = await moduleRepository.getAll();

      expect(actual).toHaveLength(2);
      expect(actual[0].teacher.firstName).toBe('Some Teacher');
      expect(actual[0].students).toHaveLength(2);
      expect(actual[0].students[0].firstName).toBe('Some Student');
      expect(actual[0].teacherId).toBe(1);
    });

    test('All by teacher', async () => {
      const moduleRepository = await initRepository();
      const actual = await moduleRepository.getAllByTeacher(1);

      expect(actual).toHaveLength(2);
      expect(actual[0].teacher.firstName).toBe('Some Teacher');
      expect(actual[0].students).toHaveLength(2);
      expect(actual[0].students[0].firstName).toBe('Some Student');
      expect(actual[0].teacherId).toBe(1);
    });

    test('All by Student', async () => {
      const moduleRepository = await initRepository();
      const student_1_modules = await moduleRepository.getAllByStudent(3);

      expect(student_1_modules).toHaveLength(2);
      expect(student_1_modules[0].teacher.firstName).toBe('Some Teacher');
      expect(student_1_modules[0].students).toHaveLength(2);
      expect(student_1_modules[0].students[0].firstName).toBe('Some Student');
      expect(student_1_modules[0].teacherId).toBe(1);

      const student_2_modules = await moduleRepository.getAllByStudent(2);

      expect(student_2_modules).toHaveLength(1);
      expect(student_2_modules[0].teacher.firstName).toBe('Some Teacher');
      expect(student_2_modules[0].students).toHaveLength(2);
      expect(student_2_modules[0].students[0].firstName).toBe('Some Student');
      expect(student_2_modules[0].teacherId).toBe(1);
    });
  });

  describe('SaveOrUpdate', () => {
    test('Save new Item', async () => {
      const moduleRepository = getCustomRepository(ModuleRepository);

      //must be saved beforehand - typeorm is not really sophisticated... saving relationship on add is only possible in one direction - see docs
      const teacher = await getDummyTeacher();
      const student = await getDummyStudent();
      const module = new ModuleEntity({
        code: '123',
        description: 'Some description',
        name: 'Global Classroom',
        teacher: teacher,
        students: [student],
      });

      await moduleRepository.saveOrUpdate(module);

      const actual = await moduleRepository.findOne(1, { relations: ['teacher', 'students'] });
      expect(actual.code).toBe(module.code);
      expect(actual.teacher).toEqual(teacher);
      expect(actual.students[0]).toEqual(student);
      expect(actual.teacherId).toBe(teacher.id);
    });

    test('update existing Item', async () => {
      const moduleRepository = await initRepository();
      const module = await moduleRepository.findOne({ relations: ['teacher', 'students'] });
      expect(module.code).toBe('123');
      module.code = '666';

      await moduleRepository.saveOrUpdate(module);

      const actual = await moduleRepository.findOne({ id: module.id });
      expect(actual.code).toBe(module.code);
    });

    test('fail validation on save or update', async () => {
      const moduleRepository = getCustomRepository(ModuleRepository);
      const module = new ModuleEntity();

      //test validation itself
      expect((await validate(module)).length).toBeGreaterThan(0);
      //should not save server cause validation errors
      try {
        await moduleRepository.saveOrUpdate(module);
      } catch (e) {
        if (Array.isArray(e) && e[0] instanceof ValidationError) {
          expect(e.find((error: ValidationError) => error.property == 'code')).toBeInstanceOf(ValidationError);
          expect(e.find((error: ValidationError) => error.property == 'name')).toBeInstanceOf(ValidationError);
          expect(e).toHaveLength(2);
        } else {
          fail('This should not have happened: ' + e);
        }
      }
      //should not find server either
      await expect(moduleRepository.find()).resolves.toHaveLength(0);
    });
  });
});
