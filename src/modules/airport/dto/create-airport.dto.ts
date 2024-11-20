import { ApiProperty } from "@nestjs/swagger";

export class CreateAirportDto {
    @ApiProperty({
        required: true
    })
    code: string;

    @ApiProperty({
        required: true
    })
    name: string;

    @ApiProperty({
        required: true
    })
    location: string;


}