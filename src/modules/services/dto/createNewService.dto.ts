import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsJSON, IsNotEmpty } from "class-validator";
import { ServiceItem } from "../type/index.type";
import { EServiceType } from "../enum/index.enum";

export class CreateNewServiceDto {
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
    @IsEnum(EServiceType)
    type: EServiceType;

    @ApiProperty({
        required: true,
    })
    price: number;
}