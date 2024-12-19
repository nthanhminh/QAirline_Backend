import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";
import { EEnvironmentLogin } from "../enums";

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

    @ApiProperty({
        required: true,
        enum: EEnvironmentLogin
    })
    environment: EEnvironmentLogin;
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