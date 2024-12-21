import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUUID } from "class-validator";
import { ENewsType } from "../enums/index.enums";
import { IsDateTimeDDMMYYYYHHMMSS } from "src/validators/index.validator";
import { IsThumbnailPath } from "src/validators/files.validator";

export class CreateNewsDto {
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    title: string

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    content: string

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    @IsThumbnailPath()
    imageUrl: string

    @ApiProperty({
        required: true,
        enum: ENewsType
    })
    @IsEnum(ENewsType)
    type: ENewsType

    @ApiProperty({
        required: false,
    })
    @IsNumber()
    @IsOptional()
    percentDiscount?: number

    @ApiProperty({
        required: false,
    })
    @IsNumber()
    @IsOptional()
    cashDiscount?: number
    
    @ApiProperty({
        required: true,
    })
    @IsArray()
    @IsUUID('4', { each: true })
    @IsOptional()
    airportIds: string[]

    @ApiProperty({
        required: false,
    })
    @IsNotEmpty()
    @IsOptional()
    @IsDateTimeDDMMYYYYHHMMSS()
    endTime?: string;
}