import { FlightPrice } from "@modules/priceForFlight/entity/priceForFlight.entity";
import { ESeatClass } from "@modules/seatsForPlaneType/enums/index.enum";
import { BaseEntity } from "@modules/shared/base/base.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class SeatClassInfo extends BaseEntity {
    @Column({
        type: "enum",
        enum: ESeatClass,
        default: ESeatClass.PREMIUM_ECONOMY
    })
    name: ESeatClass

    @Column('json')
    seatClassInfo: JSON

    @OneToMany(() => FlightPrice, (flightPrice) => flightPrice.seatClassInfo)
    flightsPrice: FlightPrice[]
}