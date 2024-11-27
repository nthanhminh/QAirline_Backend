import {
  Entity,
  Column,
  OneToMany,
} from 'typeorm';
import { ERolesUser } from '../enums/index.enum';
import { BaseEntity } from '@modules/shared/base/base.entity';
import { Booking } from '@modules/booking/entity/booking.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ length: 500 })
  name: string;

  @Column({ type: 'enum', enum: ERolesUser, default: ERolesUser.USER })
  role: ERolesUser;

  @Column('text')
  email: string;

  @Column('text')
  password: string;

  @Column('date', { default: () => 'CURRENT_DATE' })
  birthOfDate: Date;

  @Column('int')
  age: number;

  @Column('text', {
    default: null,
  })
  currentAccessToken: string;

  @Column('text', {
    default: null,
  })
  refreshToken: string;

  @OneToMany(() => Booking, (booking) => booking.flight)
  bookings: Booking[]
}
