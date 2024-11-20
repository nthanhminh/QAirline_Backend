import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VerifyCodeByEmailDto } from '@modules/auth/dto/verify-code-by-email.dto';

export class UpdatePasswordByCodeDto extends VerifyCodeByEmailDto {
	@ApiProperty({
		default: '123456',
	})
	@MinLength(6, {
		message:
			'auths.forgot password must be longer than or equal to 6 characters',
	})
	@IsNotEmpty({
		message: 'auths.forgot password login should not be empty',
	})
	// @IsStrongPassword()
	password: string;
}
