import { ApiProperty, OmitType } from "@nestjs/swagger";
import { CreateNewBookingDto } from "./createNewBooking.dto";
import { CancelTicket } from "../type/index.type";
import { IsArray } from "class-validator";

export class CancelTicketDto extends OmitType(CreateNewBookingDto, ['tickets', 'flightId'] as const)  {
    @ApiProperty({
        required: true,
        type: [CancelTicket]
    })
    @IsArray()
    ticketsData: CancelTicket[]
}