import { validate } from 'class-validator';
import { DuplicateEntryException } from 'src/common/exceptions/duplicateEntry.exception';
import { EntityRepository, QueryFailedError, Repository } from 'typeorm';
import { AttendanceEntity } from './attendance.entity';

@EntityRepository(AttendanceEntity)
export class AttendanceRepository extends Repository<AttendanceEntity> {
  async saveOrUpdate(entity: AttendanceEntity): Promise<AttendanceEntity> {
    const errors = await validate(entity);
    if (errors.length > 0) {
      throw errors;
    }
    try {
      return await this.save(entity);
    } catch (e) {
      if (e instanceof QueryFailedError && e.message.includes('ER_DUP_ENTRY')) {
        throw new DuplicateEntryException({ studentExists: true });
      }
      throw e;
    }
  }
}
