import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SendMailDto {
	@ApiProperty({
		description: '件名 *',
		default: 'subject',
		required: true,
	})
	@IsNotEmpty()
	subject: string;

	@ApiProperty({
		description: '内容 *',
		default: 'content',
		required: true,
	})
	@IsNotEmpty()
	content: string;
}
