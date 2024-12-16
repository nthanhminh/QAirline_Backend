import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class SendCodeDto {
    @ApiProperty({
        required: true
    })
    @IsEmail()
    @IsNotEmpty()
    email: string
}

export class VerifyCodeDto extends SendCodeDto {
    @ApiProperty({
        required: true
    })
    @IsNumber()
    code: number
}