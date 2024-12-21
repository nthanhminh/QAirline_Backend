import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { EMenuType } from "../enums/index.enum";
import { IsThumbnailPath } from "src/validators/files.validator";

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
    @IsThumbnailPath()
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

