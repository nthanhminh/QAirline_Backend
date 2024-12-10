import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { ERegionType } from "../enums/index.enum";

export class CreateNewAirportDto {
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    name: string

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    code: string

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    location: string

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    @IsEnum(ERegionType)
    region: string
}