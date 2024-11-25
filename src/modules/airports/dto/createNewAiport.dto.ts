import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

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
}