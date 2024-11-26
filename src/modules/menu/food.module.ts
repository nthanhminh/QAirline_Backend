import { DatabaseModule } from "@modules/databases/databases.module";
import { SharedModule } from "@modules/shared/shared.module";
import { Module } from "@nestjs/common";
import { MenuController } from "./food.controller";
import { menuProviders } from "./food.provider";
import { MenuService } from "./food.service";

@Module({
    imports: [
        DatabaseModule,
        SharedModule,
    ],
    controllers: [MenuController],
    providers: [...menuProviders, MenuService],
    exports: [MenuService],
})
export class MenuModule {}