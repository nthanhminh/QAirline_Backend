import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../interfaces/token.interface';
import { Request } from 'express';
import { EStatusUser } from '@modules/users/enums/index.enum';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@modules/users/user.services';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly usersService: UsersService,
		private readonly configService: ConfigService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<String>('JWT_ACCESS_SECRET'),
		});
	}

	async validate({ uuidAccessToken, sub }: TokenPayload) {
		const user = await this.usersService.getUserWithRole(sub);
		if (!user) {
			throw new UnauthorizedException('auths.Account not found');
		}

		if (user?.deletedAt) {
			throw new UnauthorizedException('auths.Account is deleted');
		}

		if (user?.status === EStatusUser.INACTIVE) {
			throw new UnauthorizedException('auths.Account inactive');
		}

		// if (user.currentAccessToken !== uuidAccessToken && user.role === ERolesUser.USER)
		// 	throw new UnauthorizedException(
		// 		'auths.Account is signed in on another device',
		// 	);

		return user;
	}
}
