import { ESeatClass } from "@modules/seatsForPlaneType/enums/index.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsUUID } from "class-validator";

export class UpdateAllPriceDto {
    @ApiProperty({
        required: true,
    })
    @IsUUID()
    flightId: string;

    @ApiProperty({
        required: true,
    })
    @IsArray()
    pricesData: PriceForSeatClass[]
}

export class CreateAllPriceDto {
    @ApiProperty({
        required: true,
    })
    @IsUUID()
    flightId: string;
    
    @ApiProperty({
        required: true,
    })
    @IsArray()
    pricesData: PriceCreateForSeatClass[]
}

export class PriceForSeatClass {
    @ApiProperty({
        required: true,
    })
    @IsUUID()
    id: string;

    @ApiProperty({
        required: true,
    })
    price: number;

    @ApiProperty({
        required: true,
    })
    @IsEnum(ESeatClass)
    seatClass: ESeatClass;
}

export class PriceCreateForSeatClass {
    @ApiProperty({
        required: true,
    })
    price: number;

    @ApiProperty({
        required: true,
    })
    @IsEnum(ESeatClass)
    seatClass: ESeatClass;
}