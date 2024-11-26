import { DatabaseModule } from "@modules/databases/databases.module";
import { SharedModule } from "@modules/shared/shared.module";
import { Module } from "@nestjs/common";
import { ServicesController } from "./services.controller";
import { servicesProviders } from "./services.provider";
import { ServiceHandler } from "./services.handler";

@Module({
    imports: [
        DatabaseModule,
        SharedModule
    ],
    controllers: [ServicesController],
    providers: [...servicesProviders, ServiceHandler],
    exports: [ServiceHandler]
})
export class ServiceModule {}