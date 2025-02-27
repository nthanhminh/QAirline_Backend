import { MenuModule } from "@modules/menu/food.module";
import { ServiceModule } from "@modules/services/services.module";
import { SharedModule } from "@modules/shared/shared.module";
import { forwardRef, Module } from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { TicketController } from "./ticket.controller";
import { ticketProviders } from "./ticket.provider";
import { DatabaseModule } from "@modules/databases/databases.module";
import { BookingModule } from "@modules/booking/booking.module";
import { FlightModule } from "@modules/flights/flight.module";
import { RedisCacheModule } from "@modules/redis/redis.module";

@Module({
    imports: [
        DatabaseModule,
        SharedModule,
        MenuModule,
        ServiceModule,
        forwardRef(() => BookingModule),
        FlightModule,
        RedisCacheModule
    ],
    exports: [TicketService],
    controllers: [TicketController],
    providers: [...ticketProviders, TicketService],
})
export class TicketModule {}