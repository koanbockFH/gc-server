import { IsEmail, IsNotEmpty } from 'class-validator';
import { AuditEntity } from 'src/common/entity';
import { Column, Entity } from 'typeorm';
import { UserEnum } from './enum/user.enum';

@Entity()
export class UserEntity extends AuditEntity {
  constructor(defaultValues: Partial<UserEntity> = {}) {
    super(defaultValues);

    if (defaultValues == null) return;
    this.id = defaultValues.id;
    this.firstName = defaultValues.firstName;
    this.lastName = defaultValues.lastName;
    this.code = defaultValues.code;
    this.mail = defaultValues.mail;
    this.password = defaultValues.password;
    this.userType = defaultValues.userType;
  }

  @Column()
  @IsNotEmpty()
  firstName!: string;

  @Column()
  @IsNotEmpty()
  lastName!: string;

  @Column({ unique: true })
  @IsNotEmpty()
  code!: string;

  @Column()
  @IsNotEmpty()
  password!: string;

  @Column({ unique: true })
  @IsEmail()
  mail!: string;

  @Column()
  @IsNotEmpty()
  userType!: UserEnum;
}
