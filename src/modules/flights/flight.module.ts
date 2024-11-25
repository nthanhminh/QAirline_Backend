import { DatabaseModule } from "@modules/databases/databases.module";
import { SharedModule } from "@modules/shared/shared.module";
import { Module } from "@nestjs/common";
import { flightProviders } from "./flight.provider";
import { FlightService } from "./flight.service";
import { FlightController } from "./flight.controller";

@Module({
    imports: [
        DatabaseModule,
        SharedModule
    ],
    controllers: [FlightController],
    providers: [...flightProviders, FlightService],
    exports: [FlightService]
})
export class FlightModule {}