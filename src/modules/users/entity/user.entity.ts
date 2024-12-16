import {
  Entity,
  Column,
  OneToMany,
} from 'typeorm';
import { ERolesUser, EStatusUser } from '../enums/index.enum';
import { BaseEntity } from '@modules/shared/base/base.entity';
import { Booking } from '@modules/booking/entity/booking.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseEntity {
  @Column({ length: 500 })
  name: string;

  @Column({ type: 'enum', enum: ERolesUser, default: ERolesUser.USER})
  role: ERolesUser;

  @Column({
    type: 'text',
    unique: true,
  })
  email: string;

  @Exclude()
  @Column({
    type: 'text',
  })
  password: string;

  @Column({
    type: 'enum',
    enum: EStatusUser,
    default: EStatusUser.INACTIVE
  })
  status: EStatusUser;

  @Column('date', { default: () => 'CURRENT_DATE' })
  birthOfDate: Date;

  @Column('int')
  age: number;

  @Exclude()
  @Column({
    type: 'text',
    // select: false,
    default: null
  })
  currentAccessToken: string;

  @Exclude()
  @Column({
    type: 'text',
    // select: false,
    default: null
  })
  refreshToken: string;

  @OneToMany(() => Booking, (booking) => booking.flight)
  bookings: Booking[]
}
