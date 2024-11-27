import { DatabaseModule } from "@modules/databases/databases.module";
import { SharedModule } from "@modules/shared/shared.module";
import { forwardRef, Module } from "@nestjs/common";
import { bookingProviders } from "./booking.provider";
import { BookingService } from "./booking.service";
import { BookingController } from "./booking.controller";
import { UserModule } from "@modules/users/user.module";
import { FlightModule } from "@modules/flights/flight.module";
import { TicketModule } from "@modules/ticket/ticket.module";

@Module({
    imports: [
        DatabaseModule,
        SharedModule,
        UserModule,
        FlightModule,
        forwardRef(() => TicketModule)
    ],
    controllers: [BookingController],
    providers: [...bookingProviders, BookingService],
    exports: [BookingService],
})
export class BookingModule {}