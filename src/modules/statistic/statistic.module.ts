import { DatabaseModule } from "@modules/databases/databases.module";
import { SharedModule } from "@modules/shared/shared.module";
import { Module } from "@nestjs/common";
import { StatisticService } from "./statistic.service";
import { StatisticController } from "./statistic.controller";

@Module({
    imports: [
        DatabaseModule,
        SharedModule
    ],
    providers: [StatisticService],
    controllers: [StatisticController],
})
export class StatisticModule {}