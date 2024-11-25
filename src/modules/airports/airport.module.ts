import { Module } from "@nestjs/common";
import { airportProviders } from "./airport.provider";
import { SharedModule } from "@modules/shared/shared.module";
import { DatabaseModule } from "@modules/databases/databases.module";
import { AirportsController } from "./airport.controller";
import { AirportService } from "./airport.service";

@Module({
    imports: [
        DatabaseModule,
        SharedModule
    ],
    providers: [...airportProviders, AirportService],
    controllers: [AirportsController],
    exports: [AirportService],
})
export class AirportModule {}