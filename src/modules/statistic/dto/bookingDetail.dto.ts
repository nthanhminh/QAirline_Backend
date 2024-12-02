import { EFlightStatus } from "@modules/flights/enums/index.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { IsDateTimeDDMMYYYY } from "src/validators/index.validator";

export class BookingDetailDto extends PaginationDto {
    @ApiProperty({
        required: false,
    })
    @IsOptional()
    flightCode?: string

    @ApiProperty({
        required: false,
        enum: EFlightStatus
    })
    @IsOptional()
    @IsEnum(EFlightStatus)
    status?: EFlightStatus

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @IsDateTimeDDMMYYYY()
    departureTime?: string
}