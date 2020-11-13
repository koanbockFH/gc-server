import { Injectable, NotFoundException } from '@nestjs/common';
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
      throw new NotFoundException();
    }
    const entity = await this.timeSlotRepo.saveOrUpdate(
      new TimeSlotEntity({
        ...dto,
        module,
      }),
    );
    console.log(entity.id);
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

  async delete(id: number): Promise<void> {
    await this.timeSlotRepo.delete(id);
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
