import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsUUID } from "class-validator";
import { TicketBookingItem } from "../type/index.type";

export class CreateNewBookingDto {
    @ApiProperty({
        required: true,
    })
    @IsNumber()
    paymentAmount: number

    @ApiProperty({
        required: true,
    })
    @IsUUID()
    customerId: string

    @ApiProperty({
        required: true,
    })
    @IsUUID()
    flightId: string

    @ApiProperty({
        required: true,
        type: [TicketBookingItem]
    })
    @IsArray()
    tickets: TicketBookingItem[]
}