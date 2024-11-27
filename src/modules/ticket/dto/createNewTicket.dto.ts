import { Booking } from "@modules/booking/entity/booking.entity";
import { ECustomerType } from "@modules/booking/enums/index.enum";
import { ESeatClass } from "@modules/seatsForPlaneType/enums/index.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsUUID } from "class-validator";

export class CreateNewTicketDto {
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    customerName: string

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    customerSSID: string

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    @IsEmail()
    customerEmail: string

    @ApiProperty({
        required: true,
    })
    @IsEnum(ECustomerType)
    customerType: ECustomerType

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    seatValue: string

    @ApiProperty({
        required: true,
    })
    @IsEnum(ESeatClass)
    seatClass: ESeatClass

    @ApiProperty({
        required: true,
    })
    @IsUUID()
    bookingId: string | Booking

    @ApiProperty({
        required: true,
    })
    @IsArray({
        each: true,
    })
    @IsUUID('all', { each: true })
    menuIds: string[]

    @ApiProperty({
        required: true,
    })
    @IsArray({
        each: true,
    })
    @IsUUID('all', { each: true })
    serviceIds: string[]
}