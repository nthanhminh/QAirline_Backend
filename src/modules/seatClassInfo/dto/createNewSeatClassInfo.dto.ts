import { ESeatClass } from "@modules/seatsForPlaneType/enums/index.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsJSON, IsObject } from "class-validator";

export class CreateNewSeatClassInfoDto {
    @ApiProperty({
        required: true
    })
    @IsEnum(ESeatClass)
    name: ESeatClass

    @ApiProperty({
        required: true
    })
    @IsObject()
    seatClassInfo: Object
}