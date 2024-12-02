import { ApiProperty } from "@nestjs/swagger";
import { ETicketStatisticTimeType } from "../enums/index.enum";
import { IsEnum } from "class-validator";

export class TicketStatisticDto {
    @ApiProperty({
        required: true,
        enum: ETicketStatisticTimeType,
    })
    @IsEnum(ETicketStatisticTimeType)
    timeType: ETicketStatisticTimeType
}