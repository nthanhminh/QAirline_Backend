import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { firstValueFrom, Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/decorators/auth.decorator';
import { SharedService } from '@modules/shared/shared.service';
import { getTokenFromHeader } from 'src/helper/string.helper';

@Injectable()
export class JwtAccessTokenGuard extends AuthGuard('jwt') {
	constructor(
		private reflector: Reflector,
		private readonly tokenBlacklistService: SharedService,
	) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = getTokenFromHeader(request.headers); // Get the token from the header
		console.log(token);
		// const isBlackList = await this.tokenBlacklistService.isTokenBlacklisted(
		// 	token,
		// );

		// Check if the token is revoked
		if (token && this.tokenBlacklistService.isTokenRevoked(token)) {
			console.log(token);
			console.log('revoked token');
			return false; 
		}

		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) {
			return true; // Allow access to public endpoints
		}

		// Call the parent canActivate method and ensure it returns a Promise<boolean>
		const canActivate = super.canActivate(context);

		// If canActivate is an Observable, convert it to a Promise
		if (canActivate instanceof Observable) {
			return await firstValueFrom(canActivate);
		}

		return canActivate; // It is already a boolean or a Promise<boolean>
	}
}
