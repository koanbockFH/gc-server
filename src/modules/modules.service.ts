import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(module: CreateModuleDTO): Promise<ModuleDTO> {
    const entity = await this.moduleRepo.saveOrUpdate(
      new ModuleEntity({
        ...module,
        teacher: new UserEntity({ id: module.teacherId }),
        students: module.studentIds.map(id => new UserEntity({ id })),
      }), //User must already exist
    );
    return this.getById(entity.id);
  }

  async edit(dto: ModuleDTO): Promise<ModuleDTO> {
    const module = await this.moduleRepo.getById(dto.id);
    if (module == null) {
      throw new NotFoundException();
    }

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
