import { ApiProperty } from "@nestjs/swagger";
import { ENewsType } from "../enums/index.enums";
import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";

export class FilterNewsDto extends PaginationDto {
    @ApiProperty({
        required: true,
        enum: ENewsType
    })
    @IsOptional()
    @IsEnum(ENewsType)
    type?: ENewsType
}