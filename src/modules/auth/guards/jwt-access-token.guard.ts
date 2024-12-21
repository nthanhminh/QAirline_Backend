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
		const token = getTokenFromHeader(request.headers); 

		if (token && this.tokenBlacklistService.isTokenRevoked(token)) {
			return false; 
		}

		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) {
			return true;
		}

		const canActivate = super.canActivate(context);

		if (canActivate instanceof Observable) {
			return await firstValueFrom(canActivate);
		}

		return canActivate; 
	}
}
