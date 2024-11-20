import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { RefreshTokenInterface } from '@modules/auth/interfaces/refresh-token.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
	Strategy,
	'refreshToken',
) {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<String>('JWT_Refesh_SecretKey'),
			passReqToCallback: true,
		});
	}

	async validate(request: Request, payload: RefreshTokenInterface) {
		request['payloadJwt'] = payload;

		// return await this.authService.getUserIfRefreshTokenMatched(
		// 	payload.userId,
		// 	payload.uuidRefreshToken,
		// );
	}
}
