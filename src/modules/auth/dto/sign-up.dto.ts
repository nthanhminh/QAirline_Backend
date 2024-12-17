import { IsEmail, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SignUpDto {
	@ApiProperty({
		default: 'test',
	})
	@IsNotEmpty()
	@MaxLength(50)
	name: string;

	@ApiProperty({
		default: 'test@gmail.com',
	})
	@IsOptional()
	@MaxLength(50)
	@IsEmail()
	email: string;

	@ApiProperty({
		default: '12345678',
	})
	@IsNotEmpty()
	password: string;
}
