import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EmailDto } from 'src/common/dto/email.dto';

export class VerifyCodeByEmailDto extends EmailDto {
	@ApiProperty({
		default: '123456',
	})
	@IsNotEmpty()
	code: number;
}
