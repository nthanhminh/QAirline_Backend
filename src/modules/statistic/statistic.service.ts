import { Booking } from "@modules/booking/entity/booking.entity";
import { Inject } from "@nestjs/common";
import { BookingRepository } from "@repositories/booking.repository";
import { FlightRepository } from "@repositories/flight.repository";

export class StatisticService {
    constructor(
        @Inject('BOOKING_REPOSITORY') 
        private readonly bookingRepository: BookingRepository,

        @Inject('FLIGHT_REPOSITORY')
        private readonly flightRepository: FlightRepository,

        @Inject('TICKET_REPOSITORY')
        private readonly ticketRepository: FlightRepository,
    ) {}

    
}