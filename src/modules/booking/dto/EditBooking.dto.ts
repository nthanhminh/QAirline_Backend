import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { CreateNewBookingDto } from "./createNewBooking.dto";
import { IsArray } from "class-validator";
import { EditTicket } from "../type/index.type";

export class EditBookingDto extends PartialType(
    OmitType(CreateNewBookingDto, ['tickets', 'customerId'] as const) 
) {
    @ApiProperty({
        required: true,
        type: [EditTicket]
    })
    @IsArray()
    ticketsData: EditTicket[]
}
