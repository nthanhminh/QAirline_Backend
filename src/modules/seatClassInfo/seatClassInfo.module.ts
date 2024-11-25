import { DatabaseModule } from "@modules/databases/databases.module";
import { SharedModule } from "@modules/shared/shared.module";
import { Module } from "@nestjs/common";
import { SeatClassInfoController } from "./seatClassInfo.controller";
import { SeatClassInfoService } from "./seatClassInfo.service";
import { seatClassInfoProviders } from "./seatClassInfo.provider";

@Module({
    imports: [
        DatabaseModule,
        SharedModule
    ],
    controllers: [SeatClassInfoController],
    providers: [...seatClassInfoProviders, SeatClassInfoService],
    exports: [SeatClassInfoService]
})
export class SeatClassInfoModule {}