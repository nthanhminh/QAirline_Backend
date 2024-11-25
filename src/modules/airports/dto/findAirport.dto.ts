import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";

export class FindAirportDto extends PaginationDto {
    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @IsNotEmpty()
    code: string

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @IsNotEmpty()
    location: string
}