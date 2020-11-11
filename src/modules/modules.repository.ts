import { validate } from 'class-validator';
import { EntityRepository, Repository } from 'typeorm';
import { ModuleEntity } from './module.entity';

@EntityRepository(ModuleEntity)
export class ModuleRepository extends Repository<ModuleEntity> {
  async saveOrUpdate(module: ModuleEntity): Promise<ModuleEntity> {
    const errors = await validate(module);
    if (errors.length > 0) {
      throw errors;
    }

    return await this.save(module);
  }

  async getById(id: number): Promise<ModuleEntity> {
    return (await this.findOne(id, { relations: ['teacher', 'students'] })) ?? null;
  }

  async getAll(): Promise<ModuleEntity[]> {
    return this.find({ relations: ['teacher', 'students'] });
  }

  async getAllByTeacher(teacherId: number): Promise<ModuleEntity[]> {
    return this.find({ where: { teacherId: teacherId }, relations: ['teacher', 'students'] });
  }

  async getAllByStudent(studentId: number): Promise<ModuleEntity[]> {
    const modulesEnrolled = await this.createQueryBuilder('module')
      .leftJoin('module.teacher', 'teacher')
      .leftJoinAndSelect('module.teacher', 'teacherSelect')
      .leftJoin('module.students', 'student')
      .leftJoinAndSelect('module.students', 'studentSelect')
      .where('student.id = ' + studentId)
      .getMany();

    return modulesEnrolled;
  }
}
