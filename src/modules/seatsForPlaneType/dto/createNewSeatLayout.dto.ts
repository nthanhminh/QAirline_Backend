import { EPlaneType } from "@modules/planes/enums/index.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNumber, ValidateNested } from "class-validator";
import { SeatLayoutItem } from "../types/index.type";
import { Type } from "class-transformer";

export class CreateNewSeatLayoutDto {
    @ApiProperty({
        required: true,
    })
    @IsEnum(EPlaneType)
    planeType: EPlaneType

    @ApiProperty({
        required: true,
    })
    @IsNumber()
    numberOfBusinessSeats: number

    @ApiProperty({
        required: true,
    })
    @IsNumber()
    numberOfPreminumEconomySeats: number

    @ApiProperty({
        required: true,
    })
    @IsNumber()
    numberOfEconomySeats: number

    @ApiProperty({
        required: true,
    })
    @IsNumber()
    numberOfBasicSeats: number

    @ApiProperty({
        required: true,
        type: [SeatLayoutItem],
    })
    @IsArray()
    // @ValidateNested({ each: true })
    // @Type(() => SeatLayoutItem)
    seatLayoutForPlaneType: SeatLayoutItem[]
}