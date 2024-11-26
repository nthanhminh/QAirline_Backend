import { DatabaseModule } from "@modules/databases/databases.module";
import { Module } from "@nestjs/common";
import { PriceForSeatTypeProviders } from "./priceForSeatType.provider";
import { FlightModule } from "@modules/flights/flight.module";
import { SharedModule } from "@modules/shared/shared.module";
import { PriceForSeatTypeService } from "./priceForSeatType.service";
import { PriceForSeatTypeController } from "./priceForSeatType.controller";

@Module({
    imports: [
        DatabaseModule,
        SharedModule,
        FlightModule,
    ],
    providers: [...PriceForSeatTypeProviders, PriceForSeatTypeService],
    exports: [PriceForSeatTypeService],
    controllers: [PriceForSeatTypeController],
})
export class PriceForSeatTypeModule {}