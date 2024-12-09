import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsJSON, IsNotEmpty, IsUUID } from "class-validator";
import { EPlaneType } from "../enums/index.enum";
import { Seat } from "@modules/seatsForPlaneType/entity/seat.entity";

export class CreateNewPlaneDto {
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        required: true,
    })
    @IsEnum(EPlaneType)
    type: EPlaneType;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    description: string;

    // @ApiProperty({
    //     required: true,
    // })
    // @IsNotEmpty()
    // @IsUUID()
    // seatLayoutId: string;
}
