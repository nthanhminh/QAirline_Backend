import { IsEnum, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EEnvironmentLogin } from '@modules/auth/enums';

export class SignInDto {
	@ApiProperty({
		default: EEnvironmentLogin.APP_ADMIN,
	})
	@IsEnum(EEnvironmentLogin)
	@IsNotEmpty()
	environment: EEnvironmentLogin;

	@ApiProperty({
		default: 'admin',
		description: 'email',
	})
	@MaxLength(50)
	@IsNotEmpty({
		message: 'auths.Please enter username',
	})
	accountId: string;

	@ApiProperty({
		default: '12345678',
	})
	@MinLength(6, {
		message: 'auths.Password must be longer than or equal to 6 characters',
	})
	@IsNotEmpty({
		message: 'auths.Password login should not be empty',
	})
	password: string;
}
