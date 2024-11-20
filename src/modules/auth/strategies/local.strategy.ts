import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({ usernameField: 'email' });
	}

	async validate(request: any, accountId: string, password: string) {
		const { environment } = request.body;

		// const user = await this.authService.getAuthenticatedUser(
		// 	accountId,
		// 	password,
		// 	environment,
		// );

		// return user;
	}
}
