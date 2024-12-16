import { DatabaseModule } from "@modules/databases/databases.module";
import { SharedModule } from "@modules/shared/shared.module";
import { forwardRef, Module } from "@nestjs/common";
import { SeatsController } from "./seats.controller";
import { seatProviders } from "./seats.provider";
import { SeatService } from "./seats.service";
import { TicketModule } from "@modules/ticket/ticket.module";
import { FlightModule } from "@modules/flights/flight.module";

@Module({
    imports: [
        DatabaseModule,
        SharedModule,
        forwardRef(() => FlightModule),
        TicketModule
    ],
    controllers: [SeatsController],
    providers: [...seatProviders, SeatService],
    exports: [SeatService],
})
export class SeatModule {}