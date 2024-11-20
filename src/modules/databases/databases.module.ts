import { Module } from "@nestjs/common";
import { databaseProviders } from "./databases.provider";

@Module({
    providers: [...databaseProviders],
    exports: [...databaseProviders],
})
export class DatabaseModule {}