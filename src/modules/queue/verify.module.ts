import { Module } from "@nestjs/common";
import { VerifyService } from "./verify.service";
import { VerifyProcessor } from "./verify.processor";
import { BullModule } from "@nestjs/bullmq";

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'verify-email',
        }),
    ],
    exports: [VerifyService, VerifyProcessor],
    providers: [VerifyService, VerifyProcessor],
})
export class VerifyModule {}