import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@modules/shared/base/base.entity';
import { EPlaneType } from '../enums/index.enum';
import { Seat } from '@modules/seatsForPlaneType/entity/seat.entity';
import { Flight } from '@modules/flights/entity/flight.entity';

@Entity()
export class Plane extends BaseEntity {
  @Column({ length: 500 })
  name: string;

  @Column({
    type: 'enum',
    enum: EPlaneType, 
    default: EPlaneType.A310
  })
  type: EPlaneType;

  @Column({ length: 500 })
  description: string;

  @ManyToOne(() => Seat, (seat) => seat.planes)
  @JoinColumn({ name: 'seatLayoutId' }) 
  seatLayoutId: Seat;  

  @OneToMany(() => Flight, (flight) => flight.plane)
  flights: Flight[]
}
