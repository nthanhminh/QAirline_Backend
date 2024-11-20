import { IsNotEmpty, Matches } from 'class-validator';

export class UpdatePasswordDto {
	@Matches(/^[A-Za-z0-9]+$/, {
		message:
			'auths.password value must contain only numbers and alphabetic characters',
	})
	@IsNotEmpty()
	// @IsStrongPassword()
	password: string;

	@IsNotEmpty()
	// @IsStrongPassword()
	oldPassword: string;
}
