import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { SharedModule } from '@modules/shared/shared.module';
import { UserModule } from '@modules/users/user.module';
import { VerifyModule } from '@modules/queue/verify.module';

@Module({
	imports: [
		UserModule,
		PassportModule,
		JwtModule.register({}),
		// MailModule,
		VerifyModule,
		SharedModule,
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		LocalStrategy,
		JwtAccessTokenStrategy,
		JwtRefreshTokenStrategy,
	],
})
export class AuthModule {}
