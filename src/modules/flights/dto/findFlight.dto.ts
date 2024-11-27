import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { ESortFlightBy } from "../enums/index.enum";
import { IsDateTimeDDMMYYYY } from "src/validators/index.validator";

export class FilterFlightDto extends PaginationDto {
    @ApiProperty({
        required: false,
        enum: ESortFlightBy,
        enumName: 'ESortFlightBy'
    })
    @IsOptional()
    @IsEnum(ESortFlightBy)
    sortedBy?: ESortFlightBy

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
}