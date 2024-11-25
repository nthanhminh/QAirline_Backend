import { DatabaseModule } from "@modules/databases/databases.module";
import { SharedModule } from "@modules/shared/shared.module";
import { Module } from "@nestjs/common";
import { FlightPriceController } from "./priceForFlight.controller";
import { PriceForFlightProviders } from "./priceForFlight.provider";
import { PriceFlightService } from "./priceForFlight.service";
import { FlightModule } from "@modules/flights/flight.module";
import { SeatClassInfoModule } from "@modules/seatClassInfo/seatClassInfo.module";

@Module({
    imports: [
        DatabaseModule,
        SharedModule,
        FlightModule,
        SeatClassInfoModule
    ],
    controllers: [FlightPriceController],
    providers: [...PriceForFlightProviders, PriceFlightService],
    exports: [PriceFlightService],
})
export class FlightPriceModule {}