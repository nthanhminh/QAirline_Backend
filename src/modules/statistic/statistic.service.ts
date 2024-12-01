import { Booking } from "@modules/booking/entity/booking.entity";
import { Inject } from "@nestjs/common";
import { BookingRepository } from "@repositories/booking.repository";
import { BaseServiceAbstract } from "src/services/base/base.abstract.service";

export class StatisticService extends BaseServiceAbstract<Booking> {
    constructor(
        @Inject('BOOKING_REPOSITORY') 
        private readonly bookingRepository: BookingRepository
    ) {
        super(bookingRepository);
    }

    
}