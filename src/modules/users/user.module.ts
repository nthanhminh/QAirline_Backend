import { Module } from "@nestjs/common";
import { userProviders } from "./user.provider";
import { DatabaseModule } from "@modules/databases/databases.module";
import { UsersService } from "./user.services";
import { UsersController } from "./user.controller";
import { SharedModule } from "@modules/shared/shared.module";

@Module({
    imports: [
        DatabaseModule,
        SharedModule
    ],
    exports: [...userProviders, UsersService],
    providers: [...userProviders, UsersService],
    controllers: []
})
export class UserModule {}