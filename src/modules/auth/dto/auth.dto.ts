import { User } from "@modules/users/entity/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class AuthDto {
    @ApiProperty({
        required: true,
    })
    name: string

    @ApiProperty({
        required: true,
    })
    email: string

    @ApiProperty({
        required: true,
    })
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
  