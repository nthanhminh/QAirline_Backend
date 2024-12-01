import { Entity, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@modules/shared/base/base.entity';
import { EBookingStatus } from '../enums/index.enum';
import { User } from '@modules/users/entity/user.entity';
import { Flight } from '@modules/flights/entity/flight.entity';
import { Ticket } from '@modules/ticket/entity/ticket.entity';

@Entity()
export class Booking extends BaseEntity {
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  bookingDate: Date;

  @Column({
    type: 'enum',
    enum: EBookingStatus,
    default: EBookingStatus.ACTIVE
  })
  status: EBookingStatus;

  @ManyToOne(() => User, (user) => user.bookings, { eager: true })
  @JoinColumn({ name: 'userId' })
  customer: User;

  @ManyToOne(() => Flight, (flight) => flight.bookings, { eager: true })
  @JoinColumn({ name: 'flightId' })
  flight: Flight;

  @OneToMany(() => Ticket, (ticket) => ticket.booking)
  tickets: Ticket[];
}
