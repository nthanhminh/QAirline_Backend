import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CheckinDto {
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    seatValue: string
}