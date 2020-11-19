import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UserDTO } from 'src/users/dto/user.dto';
import { UserEnum } from 'src/users/enum/user.enum';
import { UserEntity } from 'src/users/user.entity';
import { UserRepository } from 'src/users/users.repository';
import { CreateModuleDTO } from './dto/create.module.dto';
import { ModuleDTO } from './dto/module.dto';
import { ModuleEntity } from './module.entity';
import { ModuleRepository } from './modules.repository';

@Injectable()
export class ModulesService {
  constructor(private moduleRepo: ModuleRepository, private userRepository: UserRepository) {}

  async validateUserList(dto: ModuleDTO | CreateModuleDTO): Promise<void> {
    const asyncFilter = async (arr, predicate) =>
      Promise.all(arr.map(predicate)).then(results => arr.filter((_v, index) => results[index]));

    dto.students = await asyncFilter(dto.students, async s => {
      const student = await this.userRepository.findOne({ id: s.id, userType: 2 });
      if (student) return s;
    });
    if (!(await this.userRepository.findOne({ id: dto.teacher.id, userType: 1 }))) {
      dto.teacher = null;
    }
  }

  async create(dto: CreateModuleDTO): Promise<ModuleDTO> {
    await this.validateUserList(dto);
    if (dto.teacher == null) {
      throw new HttpException('Given teacher id does not belong to a teacher.', HttpStatus.CONFLICT);
    }
    const entity = await this.moduleRepo.saveOrUpdate(
      new ModuleEntity({
        ...dto,
        teacher: new UserEntity(dto.teacher),
        students: dto.students.map(s => new UserEntity(s)),
      }), //User must already exist
    );
    return this.getById(entity.id);
  }

  async edit(dto: ModuleDTO): Promise<ModuleDTO> {
    const module = await this.moduleRepo.getById(dto.id);
    if (module == null) {
      throw new NotFoundException();
    }
    await this.validateUserList(dto);
    module.mapValues({
      ...dto,
      teacher: new UserEntity(dto.teacher),
      students: dto.students.map(s => new UserEntity(s)),
    });

    const savedValue = await this.moduleRepo.saveOrUpdate(module);

    return this.getById(savedValue.id);
  }

  async getById(id: number): Promise<ModuleDTO> {
    const result = await this.moduleRepo.getById(id);

    if (result == null) {
      throw new NotFoundException();
    }

    return new ModuleDTO({
      ...result,
      teacher: new UserDTO(result.teacher),
      students: result.students.map(s => new UserDTO(s)),
    });
  }

  async delete(id: number): Promise<void> {
    await this.moduleRepo.delete(id);
  }

  async getAll(): Promise<ModuleDTO[]> {
    const resultList = await this.moduleRepo.getAll();

    return resultList.map(
      result =>
        new ModuleDTO({
          ...result,
          teacher: new UserDTO(result.teacher),
          students: result.students.map(s => new UserDTO(s)),
        }),
    );
  }

  async getAllByUser(userId: number): Promise<ModuleDTO[]> {
    const user = await this.userRepository.findOne(userId);
    let resultList;
    switch (user.userType) {
      case UserEnum.ADMIN:
        resultList = await this.moduleRepo.getAll();
        break;
      case UserEnum.STUDENT:
        resultList = await this.moduleRepo.getAllByStudent(userId);
        break;
      case UserEnum.TEACHER:
        resultList = await this.moduleRepo.getAllByTeacher(userId);
        break;
    }

    return resultList.map(
      result =>
        new ModuleDTO({
          ...result,
          teacher: new UserDTO(result.teacher),
          students: result.students.map(s => new UserDTO(s)),
        }),
    );
  }
}
