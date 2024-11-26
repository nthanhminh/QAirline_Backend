import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";
import { IsDateTimeDDMMYYYYHHMMSS, IsTimeFormat } from "src/validators/index.validator";

export class CreateNewFlightDto {
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    flightCode: string;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    @IsDateTimeDDMMYYYYHHMMSS()
    departureTime: string;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    @IsTimeFormat()
    duration: string;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        required: true,
    })
    @IsUUID()
    fromAirportId: string;

    @ApiProperty({
        required: true,
    })
    @IsUUID()
    toAirportId: string;

    @ApiProperty({
        required: true,
    })
    @IsUUID()
    planeId: string;

    @ApiProperty({
        required: true,
    })
    @IsNumber()
    window_seat_price: number;
    
    @ApiProperty({
        required: true,
    })
    @IsNumber()
    aisle_seat_price: number;
    
    @ApiProperty({
        required: true,
    })
    @IsNumber()
    exit_row_seat_price: number;
}