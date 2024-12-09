import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { EMenuType } from "../enums/index.enum";

export class CreateNewFoodDto {
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    thumbnail: string;

    @ApiProperty({
        required: true,
    })
    @IsNumber()
    price: number;

    @ApiProperty({
        required: true,
    })
    @IsEnum(EMenuType)
    type: EMenuType
}

