import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsStrongPassword, Matches, Min } from "class-validator";

export class CreateNewUserDto {
    @ApiProperty({
        required: true
    })
    @IsNotEmpty()
    @Matches(/^[A-Za-z]+$/, {
        message: 'Name must contain only alphabetic characters.',
    })
    name: string;

    @ApiProperty({
        required: true
    })
    @IsNumber()
    @Min(16, {
        message: 'Age must be greater than or equal to 16.'
    })
    age: number;

    @ApiProperty({
        required: true
    })
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

    @ApiProperty({
        required: true
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        required: true
    })
    @IsNotEmpty()
    @Matches(
        /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
        { message: 'Date of birth must be in the format dd/mm/yyyy.' }
    )
    birthOfDate: string;
}