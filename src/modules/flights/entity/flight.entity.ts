import { Entity, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@modules/shared/base/base.entity';
import { FlightPrice } from '@modules/priceForFlight/entity/priceForFlight.entity';
import { Airport } from '@modules/airports/entity/airport.entity';
import { PriceForSeatType } from '@modules/priceSeatTypeForFlight/entity/priceForSeatType.entity';
import { Plane } from '@modules/planes/entity/plane.entity';
import { Booking } from '@modules/booking/entity/booking.entity';
import { EFlightStatus } from '../enums/index.enum';

  @Entity()
  export class Flight extends BaseEntity {
    @Column({
      type: 'enum',
      enum: EFlightStatus,
      default: EFlightStatus.ACTIVE
    })
    status: EFlightStatus

    @Column({ length: 500 })
    name: string;

    @Column('text')
    flightCode: string;

    @Column({
      type: 'timestamp',
      default: new Date()
    })
    departureTime: Date;

    @Column('int')
    duration: number;

    @Column('float', { default: 0 })
    window_seat_price: number;

    @Column('float', { default: 0 })
    aisle_seat_price: number;

    @Column('float', { default: 0 })
    exit_row_seat_price: number;

    @Column({ length: 500, default: '' })
    description: string;

    @ManyToOne(() => Airport, (airport) => airport.departingFlights, { eager: true })
    @JoinColumn({ name: 'fromAirportId' })
    fromAirport: Airport;

    @ManyToOne(() => Airport, (airport) => airport.arrivingFlights, { eager: true })
    @JoinColumn({ name: 'toAirportId' })
    toAirport: Airport;

    @ManyToOne(() => Plane, (plane) => plane.flights, { eager: true })
    @JoinColumn({ name: 'planeId' })
    plane: Plane;

    @OneToMany(() => FlightPrice, (flightPrice) => flightPrice.flight)
    flightsPrice: FlightPrice[]

    @OneToMany(() => PriceForSeatType, (priceForSeatType) => priceForSeatType.flight)
    flightsPriceForSeatType: PriceForSeatType[]

    @OneToMany(() => Booking, (booking) => booking.flight)
    bookings: Booking[]
}
