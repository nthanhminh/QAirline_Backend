import { ApiProperty } from "@nestjs/swagger";

export class CreateNewUserDto {
    @ApiProperty({
        required: true
    })
    name: string;

    @ApiProperty({
        required: true
    })
    age: number;

    @ApiProperty({
        required: true
    })
    password: string;

    @ApiProperty({
        required: true
    })
    email: string;

    @ApiProperty({
        required: true
    })
    birthOfDate: string;
}