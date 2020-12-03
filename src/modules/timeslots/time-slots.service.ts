import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEnum } from 'src/users/enum/user.enum';
import { UserEntity } from 'src/users/user.entity';
import { ModuleRepository } from '../modules.repository';
import { CreateTimeSlotDTO } from './dto/create.time-slots.dto';
import { TimeSlotDTO } from './dto/time-slots.dto';
import { TimeSlotEntity } from './time-slots.entity';
import { TimeSlotRepository } from './time-slots.repository';

@Injectable()
export class TimeSlotsService {
  constructor(private timeSlotRepo: TimeSlotRepository, private moduleRepo: ModuleRepository) {}

  async create(moduleId: number, dto: CreateTimeSlotDTO): Promise<TimeSlotDTO> {
    const module = await this.moduleRepo.getById(moduleId);
    if (module == null) {
      throw new NotFoundException('Module not found.');
    }
    const entity = await this.timeSlotRepo.saveOrUpdate(
      new TimeSlotEntity({
        ...dto,
        module,
      }),
    );
    return this.getById(entity.id);
  }

  async edit(moduleId: number, dto: TimeSlotDTO): Promise<TimeSlotDTO> {
    const module = await this.moduleRepo.getById(moduleId);
    if (module == null) {
      throw new NotFoundException('Module not found.');
    }
    const timeSlot = await this.timeSlotRepo.getById(dto.id);
    if (timeSlot == null) {
      throw new NotFoundException('TimeSlot not found.');
    }

    timeSlot.mapValues({
      ...dto,
      module,
    });

    const savedValue = await this.timeSlotRepo.saveOrUpdate(timeSlot);

    return this.getById(savedValue.id);
  }

  async getById(id: number): Promise<TimeSlotDTO> {
    const result = await this.timeSlotRepo.getById(id);

    if (result == null) {
      throw new NotFoundException();
    }
    return new TimeSlotDTO({
      ...result,
    });
  }

  async delete(user: UserEntity, id: number): Promise<void> {
    if (user.userType == UserEnum.ADMIN) {
      await this.timeSlotRepo.delete(id);
    } else {
      const modules = await this.moduleRepo.getAllByTeacher(user.id);
      const timeSlot = await this.timeSlotRepo.getById(id);
      if (timeSlot != null && modules.some(m => timeSlot.moduleId == m.id)) {
        await this.timeSlotRepo.delete(id);
      } else {
        throw new NotFoundException('TimeSlot not found.');
      }
    }
  }

  async getAll(moduleId: number): Promise<TimeSlotDTO[]> {
    const resultList = await this.timeSlotRepo.getAll(moduleId);

    return resultList.map(
      result =>
        new TimeSlotDTO({
          ...result,
        }),
    );
  }
}
