import { Flight } from "@modules/flights/entity/flight.entity";
import { BaseEntity } from "@modules/shared/base/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class PriceForSeatType extends BaseEntity {
    @Column('float')
    window_seat_price: number;

    @Column('float')
    aisle_seat_price: number;

    @Column('float')
    exit_row_seat_price: number;

    @ManyToOne(() => Flight, (flight) => flight.flightsPriceForSeatType)
    @JoinColumn({ name: 'flightId' })
    flight: Flight;
}