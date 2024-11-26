import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsUUID } from "class-validator";

export class CreateNewPriceForSeatTypeDto {
    @ApiProperty({
        required: true,
    })
    @IsNumber()
    window_seat_price: number

    @ApiProperty({
        required: true,
    })
    @IsNumber()
    aisle_seat_price: number

    @ApiProperty({
        required: true,
    })
    @IsNumber()
    exit_row_seat_price: number

    @ApiProperty({
        required: true,
    })
    @IsUUID()
    flightId: string
}