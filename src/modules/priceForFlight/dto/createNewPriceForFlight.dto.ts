import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsUUID } from "class-validator";

export class CreateNewPriceForFlightDto {
    @ApiProperty({
        required: true
    })
    @IsNumber()
    price: number
 
    @ApiProperty({
        required: true
    })
    @IsUUID()
    flightId: string

    @ApiProperty({
        required: true
    })
    @IsUUID()
    seatClassInfoId: string
}