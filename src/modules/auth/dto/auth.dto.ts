import { User } from "@modules/users/entity/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { EEnvironmentLogin } from "../enums";
import { IsEmail, IsEnum, IsNotEmpty, IsStrongPassword } from "class-validator";

export class AuthDto {
    @ApiProperty({
        required: true,
        enum: EEnvironmentLogin
    })
    @IsEnum(EEnvironmentLogin)
    environment: EEnvironmentLogin

    @ApiProperty({
        required: true,
        default: 'admin@gmail.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        required: true,
        default: '12345678'
    })
    @IsNotEmpty()
    password: string
}

export class AuthResponseDto {
    @ApiProperty({ description: 'The access token for the user' })
    accessToken: string;
  
    @ApiProperty({ description: 'The refresh token for the user' })
    refreshToken: string;

    @ApiProperty({ description: 'The refresh token for the user' })
    user: User;
}
  