import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class EmailDto {
	@ApiProperty({
		default: '@1bitlab.io',
	})
	// @Transform(params => {
	// 	return params?.value.toLowerCase();
	// })
	@IsNotEmpty()
	@MaxLength(50)
	@IsEmail()
	email: string;
}
