  import { Entity, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
  import { BaseEntity } from '@modules/shared/base/base.entity';
  import { FlightPrice } from '@modules/priceForFlight/entity/priceForFlight.entity';
import { Airport } from '@modules/airports/entity/airport.entity';

  @Entity()
  export class Flight extends BaseEntity {
    @Column({ length: 500 })
    name: string;

    @Column('text')
    flightCode: string;

    @Column('date')
    departureTime: Date;

    @Column('int')
    duration: number;

    @Column({ length: 500 })
    description: string;

    @ManyToOne(() => Airport, (airport) => airport.departingFlights, { eager: true })
    @JoinColumn({ name: 'fromAirportId' })
    fromAirport: Airport;

    @ManyToOne(() => Airport, (airport) => airport.arrivingFlights, { eager: true })
    @JoinColumn({ name: 'toAirportId' })
    toAirport: Airport;

    @OneToMany(() => FlightPrice, (flightPrice) => flightPrice.flight)
    flightsPrice: FlightPrice[]
  }
