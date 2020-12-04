import { AuditEntity } from 'src/common/entity';
import { TimeSlotEntity } from 'src/modules/timeslots/time-slots.entity';
import { UserEntity } from 'src/users/user.entity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

@Entity()
@Index(['studentId', 'timeslotId'], { unique: true })
export class AttendanceEntity extends AuditEntity {
  constructor(defaultValues: Partial<AttendanceEntity> = {}) {
    super(defaultValues);

    this.mapValues(defaultValues);
  }

  mapValues(defaultValues: Partial<AttendanceEntity> = {}): void {
    if (defaultValues == null) return;
    this.id = defaultValues.id;
    this.timeslotId = defaultValues.timeslotId;
    this.studentId = defaultValues.studentId;
  }

  @Column()
  studentId!: number;

  @Column()
  timeslotId!: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  student!: UserEntity;

  @ManyToOne(() => TimeSlotEntity, { onDelete: 'CASCADE' })
  timeslot!: TimeSlotEntity;
}
