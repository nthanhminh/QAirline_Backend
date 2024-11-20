import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateInfoDto {
	@ApiProperty({
		default: 'userName',
		required: false,
	})
	@Transform(({ value }) => value.toLowerCase()) // Transform the value to lowercase
	@IsOptional()
	userName: string;

	@ApiProperty({
		default: 'test@gmail.com',
		required: false,
	})
	@IsOptional()
	email: string;
}
