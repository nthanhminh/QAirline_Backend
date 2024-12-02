import { DatabaseModule } from "@modules/databases/databases.module";
import { SharedModule } from "@modules/shared/shared.module";
import { Module } from "@nestjs/common";
import { NewsController } from "./news.controller";
import { newsProviders } from "./news.provider";
import { NewsService } from "./news.service";
import { AirportModule } from "@modules/airports/airport.module";

@Module({
    imports: [
        DatabaseModule,
        SharedModule,
        AirportModule
    ],
    controllers: [NewsController],
    providers: [...newsProviders, NewsService],
    exports: [NewsService]
})
export class NewsModule {}