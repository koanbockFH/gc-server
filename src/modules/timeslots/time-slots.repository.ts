import { validate } from 'class-validator';
import { EntityRepository, Repository } from 'typeorm';
import { TimeSlotEntity } from './time-slots.entity';

@EntityRepository(TimeSlotEntity)
export class TimeSlotRepository extends Repository<TimeSlotEntity> {
  async saveOrUpdate(timeSlot: TimeSlotEntity): Promise<TimeSlotEntity> {
    const errors = await validate(timeSlot);
    if (errors.length > 0) {
      throw errors;
    }

    return await this.save(timeSlot);
  }

  async getById(id: number): Promise<TimeSlotEntity> {
    return (await this.findOne(id, { relations: ['module'] })) ?? null;
  }

  async getAll(moduleId: number): Promise<TimeSlotEntity[]> {
    return this.find({ where: { moduleId: moduleId }, relations: ['module'] });
  }
}
