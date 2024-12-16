import { DatabaseModule } from "@modules/databases/databases.module";
import { SharedModule } from "@modules/shared/shared.module";
import { forwardRef, Module } from "@nestjs/common";
import { planeProviders } from "./planes.provider";
import { PlaneController } from "./planes.controller";
import { PlaneService } from "./planes.service";
import { SeatModule } from "@modules/seatsForPlaneType/seats.module";

@Module({
    imports: [
        DatabaseModule,
        SharedModule,
        forwardRef(() => SeatModule),
    ],
    controllers: [PlaneController],
    providers: [...planeProviders, PlaneService],
    exports: [PlaneService],    
})
export class PlaneModule {}