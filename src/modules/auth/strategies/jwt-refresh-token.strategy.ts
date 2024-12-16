import { Request } from 'express';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { RefreshTokenInterface } from '@modules/auth/interfaces/refresh-token.interface';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@modules/users/user.services';
import { TokenPayload } from '../interfaces/token.interface';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
	Strategy,
	'refreshToken',
) {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
		private readonly userService: UsersService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<String>('JWT_REFRESH_SECRET'),
		});
	}

	async validate({sub}: TokenPayload) {
		const user = await this.userService.findUserById(sub);

		if (!user) {
		throw new NotFoundException('user not found');
		}

		return user; 
	}
}
