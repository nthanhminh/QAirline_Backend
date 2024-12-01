import { ESeatClass } from "@modules/seatsForPlaneType/enums/index.enum";
import { ECustomerType } from "../enums/index.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

export class TicketBookingItem {
    @ApiProperty({
        required: true,
    })
    customerName: string;

    @ApiProperty({
        required: true,
    })
    customerType: ECustomerType;

    @ApiProperty({
        required: true,
    })
    customerSSID: string;

    @ApiProperty({
        required: true,
    })
    customerEmail: string;

    @ApiProperty({
        required: true,
    })
    @IsOptional()
    seatValue?: string;

    @ApiProperty({
        required: true,
    })
    seatClass: ESeatClass;

    @ApiProperty({
        required: true,
        type: [String],
    })
    @IsArray() 
    @IsUUID('4', { each: true }) 
    menuIds: string[];

    @ApiProperty({
    required: true,
    type: [String], 
    })
    @IsArray() 
    @IsUUID('4', { each: true })  
    servicesIds: string[];
}

export class EditTicket {
    @ApiProperty({
        required: true,
    })
    @IsUUID()
    ticketId: string;

    @ApiProperty({
        required: true,
    })
    @IsOptional()
    seatValue?: string;

    @ApiProperty({
        required: true,
    })
    @IsOptional()
    @IsEnum(ESeatClass)
    seatClass?: ESeatClass;

    @ApiProperty({
        required: true,
    })
    @IsString()
    @IsOptional()
    customerName?: string;
}

export class CancelTicket {
    @ApiProperty({
        required: true,
    })
    @IsUUID()
    ticketId: string;
}