import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class UpdatePasswordByCodeDto {
    @ApiProperty({
        required: true,
    })
    @IsNumber()
    code: number;

    @ApiProperty({
        required: true,
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    password: string;
}

export class UpdatePasswordDto {
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    oldPassword: string;
}