import { DatabaseModule } from "@modules/databases/databases.module";
import { SharedModule } from "@modules/shared/shared.module";
import { Module } from "@nestjs/common";
import { flightProviders } from "./flight.provider";
import { FlightService } from "./flight.service";
import { FlightController } from "./flight.controller";
import { AirportModule } from "@modules/airports/airport.module";
import { PlaneModule } from "@modules/planes/plane.module";

@Module({
    imports: [
        DatabaseModule,
        SharedModule,
        AirportModule,
        PlaneModule
    ],
    controllers: [FlightController],
    providers: [...flightProviders, FlightService],
    exports: [FlightService]
})
export class FlightModule {}