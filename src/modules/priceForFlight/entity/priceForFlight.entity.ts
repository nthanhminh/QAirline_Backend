import { Flight } from "@modules/flights/entity/flight.entity";
import { SeatClassInfo } from "@modules/seatClassInfo/entity/seatClassInfo.entity";
import { BaseEntity } from "@modules/shared/base/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class FlightPrice extends BaseEntity {
    @Column('float')
    price: number;

    @ManyToOne(() => SeatClassInfo, (seatClassInfo) => seatClassInfo.flightsPrice)
    @JoinColumn({ name: 'seatClassId' })
    seatClassInfo: SeatClassInfo;

    @ManyToOne(() => Flight, (flight) => flight.flightsPrice)
    @JoinColumn({ name: 'flightId' })
    flight: Flight;
}