import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { EFlightStatus, ESortFlightByDeparture, ESortFlightByPrice } from "../enums/index.enum";
import { IsDateTimeDDMMYYYY } from "src/validators/index.validator";

export class FilterFlightDto extends PaginationDto {
    @ApiProperty({
        required: false,
        enum: ESortFlightByPrice,
        enumName: 'ESortFlightByPrice'
    })
    @IsOptional()
    @IsEnum(ESortFlightByPrice)
    sortedByPrice?: ESortFlightByPrice

    @ApiProperty({
        required: false,
        enum: ESortFlightByDeparture,
        enumName: 'ESortFlightByDeparture'
    })
    @IsOptional()
    @IsEnum(ESortFlightByDeparture)
    sortedByDeparture?: ESortFlightByDeparture

    @ApiProperty({
        required: false,
    })
    @IsUUID()
    @IsOptional()
    fromAiportId?: string;

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @IsUUID()
    toAiportId?: string;

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @IsDateTimeDDMMYYYY()
    departureTime?: string;

    @ApiProperty({
        required: false,
        enum: EFlightStatus
    })
    @IsOptional()
    @IsEnum(EFlightStatus)
    status?: EFlightStatus;
}