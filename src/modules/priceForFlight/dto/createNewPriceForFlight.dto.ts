import { ESeatClass } from "@modules/seatsForPlaneType/enums/index.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsUUID } from "class-validator";

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
    @IsEnum(ESeatClass)
    seatClass: ESeatClass
}