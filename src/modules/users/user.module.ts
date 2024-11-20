import { Module } from "@nestjs/common";
import { userProviders } from "./user.provider";
import { DatabaseModule } from "@modules/databases/databases.module";
import { UsersService } from "./user.services";
import { UsersController } from "./user.controller";

@Module({
    imports: [DatabaseModule],
    exports: [...userProviders, UsersService],
    providers: [...userProviders, UsersService],
    controllers: [UsersController]
})
export class UserModule {}