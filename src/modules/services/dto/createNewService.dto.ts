import { ApiProperty } from "@nestjs/swagger";
import { IsJSON, IsNotEmpty } from "class-validator";
import { ServiceItem } from "../type/index.type";

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
    @IsJSON()
    services: ServiceItem[];
}