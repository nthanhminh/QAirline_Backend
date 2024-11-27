import { EBookingStatus } from "@modules/booking/enums/index.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export class StatusChangeDto {
    @ApiProperty({
        required: true,
    })
    @IsEnum(EBookingStatus)
    status: EBookingStatus
}