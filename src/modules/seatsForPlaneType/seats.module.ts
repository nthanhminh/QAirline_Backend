import { DatabaseModule } from "@modules/databases/databases.module";
import { SharedModule } from "@modules/shared/shared.module";
import { Module } from "@nestjs/common";
import { SeatsController } from "./seats.controller";
import { seatProviders } from "./seats.provider";
import { SeatService } from "./seats.service";

@Module({
    imports: [
        DatabaseModule,
        SharedModule
    ],
    controllers: [SeatsController],
    providers: [...seatProviders, SeatService],
    exports: [SeatService],
})
export class SeatModule {}