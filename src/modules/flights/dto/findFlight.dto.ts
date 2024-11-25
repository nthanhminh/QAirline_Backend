import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { ESortFlightBy } from "../enums/index.enum";

export class FilterFlightDto extends PaginationDto {
    // @ApiProperty({
    //     required: true
    // })
    // @IsNotEmpty()
    // flightCode: string

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsEnum(ESortFlightBy)
    sortedBy: ESortFlightBy
}