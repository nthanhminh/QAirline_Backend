import {
    Entity,
    Column,
    OneToMany,
  } from 'typeorm';
  import { BaseEntity } from '@modules/shared/base/base.entity';
import { Flight } from '@modules/flights/entity/flight.entity';
  
  @Entity()
  export class Airport extends BaseEntity {
    @Column({ length: 500 })
    name: string;

    @Column({ length: 500 })
    code: string;

    @Column({ length: 500 })
    location: string;  

    @OneToMany(() => Flight, (flight) => flight.fromAirport)
    departingFlights: Flight[];

    @OneToMany(() => Flight, (flight) => flight.toAirport)
    arrivingFlights: Flight[];
}
  