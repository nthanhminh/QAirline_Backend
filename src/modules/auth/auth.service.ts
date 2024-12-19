// import { User } from '@modules/users/entities/user.entity';
import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	HttpStatus,
	Injectable,
	NotFoundException,
	UnauthorizedException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token.interface';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { AppResponse } from '../../types/common.type';
import { SharedService } from '@modules/shared/shared.service';
import { User } from '@modules/users/entity/user.entity';
import { UsersService } from '../users/user.services';
import { CreateNewUserDto } from '@modules/users/dto/createNewUser.dto';
import { AuthDto, AuthResponseDto } from './dto/auth.dto';
import { VerifyService } from '@modules/queue/verify.service';
import { CacheService } from '@modules/redis/redis.service';
import { SendCodeDto, VerifyCodeDto } from './dto/sendCode.dto';
import { ERolesUser, EStatusUser } from '@modules/users/enums/index.enum';
import { UpdatePasswordByCodeDto, UpdatePasswordDto } from './dto/updatePasswordByCode.dto';
import { TokenType } from './type/index.type';
import { UpdateResult } from 'typeorm';
import { EEnvironmentLogin } from './enums';

@Injectable()
export class AuthService {
	private SALT_ROUND = 11;
	private expTime;

	constructor(
		private configService: ConfigService,
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly sharedService: SharedService,
		private readonly verifyService: VerifyService,
		private readonly redisService: CacheService
	) {
		this.expTime = this.configService.get<number>(
			'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
		);
	}

	async signUp(createUserDto: CreateNewUserDto): Promise<AppResponse<AuthResponseDto>> {
		const userExists = await this.usersService.findByEmail(
		  createUserDto.email,
		);
		if (userExists) {
		  throw new BadRequestException('User already exists');
		}
		const hash = await this.hashData(createUserDto.password);
		const newUser = await this.usersService.create({
		  ...createUserDto,
		  password: hash,
		});
		const tokens = await this.getTokens(
		  newUser.id,
		  newUser.name,
		  newUser.role,
		);
		await this.updateRefreshToken(newUser.id, tokens.refreshToken);
		await this.getCode({email: createUserDto.email})
		return {
			data: {
				...tokens,
				user: newUser
			}
		};
	  }

	async getCode({email}: SendCodeDto): Promise<string> {
		const code = Math.floor(100000 + Math.random() * 900000).toString();
		try {
			const user = await this.usersService.findByEmail(email);
			await this.redisService.setCache(`${user.id}:code`, code, 300);
			await this.verifyService.addVerifyJob({
				code: code,
				email: email.toLowerCase(),
			});
			return 'auths.send code successfully'
		} catch (error) {
			throw new NotFoundException('auths.error happens');
		}
	}

	async verifyCode({email, code}: VerifyCodeDto): Promise<User> {
		const user = await this.usersService.findByEmail(email);
		const codeInRedis = await this.redisService.getCache(`${user.id}:code`);
		if(code.toString() !== codeInRedis.toString()) {
			throw new UnauthorizedException(`auths.Invalid code`);
		}
		if(user.status === EStatusUser.ACTIVE) {
			return user;
		}
		const updatedUser = await this.usersService.updateUser({
			status: EStatusUser.ACTIVE
		}, user)
		return updatedUser;
	}

	async updatePasswordByCode(dto: UpdatePasswordByCodeDto) : Promise<User> {
		const {email, password, code, environment} = dto;
		const user = await this.usersService.findByEmail(email);
		if (!user) throw new NotFoundException('users.user not found');
		switch (environment) {
			case EEnvironmentLogin.APP_ADMIN:
				if(user.role !== ERolesUser.ADMIN) {
					throw new ForbiddenException();
				}
				break;
			case EEnvironmentLogin.APP_USER:
				if(user.role !== ERolesUser.USER) {
					throw new ForbiddenException();
				}
				break;
		}
		const codeInRedis = await this.redisService.getCache(`${user.id}:code`);
		if(code.toString() !== codeInRedis.toString()) {
			throw new UnprocessableEntityException('auths.invalid code');
		}
		const hashedPassword = await this.hashData(password);
		const updatedUser = await this.usersService.updateUser({
			password: hashedPassword
		}, user);
		return updatedUser;
	}

	async updatePassword({password, oldPassword} : UpdatePasswordDto, user: User) : Promise<User> {
		if(user.password === oldPassword) {
			throw new BadRequestException('auths.old and new passwords must be different');
		}
		const hashedNewPassword = await this.hashData(password);
		const updatedUser = await this.usersService.updateUser({
			password: hashedNewPassword
		}, user);
		return updatedUser;
	}

	async signIn(data: AuthDto) : Promise<AppResponse<AuthResponseDto>> {
		const {environment} = data;
		const user = await this.usersService.findByEmail(data.email);
		if (!user) throw new BadRequestException('User does not exist');
		switch (environment) {
			case EEnvironmentLogin.APP_ADMIN:
				if(user.role !== ERolesUser.ADMIN) {
					throw new ForbiddenException();
				}
				break;
			case EEnvironmentLogin.APP_USER:
				if(user.role !== ERolesUser.USER) {
					throw new ForbiddenException();
				}
				break;
		}
		const passwordMatches = await argon2.verify(user.password, data.password);
		if (!passwordMatches)
			throw new BadRequestException('Password is incorrect');
		const tokens = await this.getTokens(user.id, user.name, user.role);
		await this.redisService.setCache(`${user.id}:refreshToken`, tokens.refreshToken, 60);
		await this.updateRefreshToken(user.id, tokens.refreshToken);
		await this.updateAccessToken(user.id, tokens.accessToken);
		return {
			data: {
				...tokens,
				user
			}
		};
	}

	async logout(user: User) : Promise<User> {
		this.sharedService.addToBlacklist(user.currentAccessToken);
		return this.usersService.update(user.id, { refreshToken: null });
	}

	generateEmailToken() {
		const randomString = crypto
			.randomBytes(length)
			.toString('hex')
			.slice(0, length);
		return randomString;
	}

	hashData(data: string) {
		return argon2.hash(data);
	}


	async updateRefreshToken(userId: string, refreshToken: string) {
		const hashedRefreshToken = await this.hashData(refreshToken);
		await this.redisService.setCacheWithSameTTL(`${userId}:refreshToken`, hashedRefreshToken);
		await this.usersService.update(userId, {
			refreshToken: hashedRefreshToken,
		});
	}

	async updateAccessToken(userId: string, accessToken: string) {
		await this.usersService.update(userId, {
			currentAccessToken: accessToken,
		});
	}

	async getTokens(userId: string, username: string, role: string) : Promise<TokenType> {
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(
				{
					sub: userId,
					username,
					role,
				},
				{
					secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
					expiresIn: '1d',
				},
			),
			this.jwtService.signAsync(
				{
					sub: userId,
					username,
					role,
				},
				{
					secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
					expiresIn: '7d',
				},
			),
		]);
		return {
			accessToken,
			refreshToken,
		};
	}

	async refreshTokens(user: User) {
		if (!user || !user.refreshToken)
			throw new ForbiddenException('Access Denied');
		const tokenInRedis = await this.redisService.getCache(`${user.id}:refreshToken`);
		if(!tokenInRedis) {
			throw new ForbiddenException('Access Denied');
		}
		const refreshTokenMatches = tokenInRedis === user.refreshToken;
		if (!refreshTokenMatches) {
			throw new ForbiddenException('Access Denied');
		}
		const tokens = await this.getTokens(user.id, user.name, user.role);
		await this.updateRefreshToken(user.id, tokens.refreshToken);
		await this.updateRefreshToken(user.id, tokens.accessToken);
		return {
			accessToken: tokens.accessToken,
		};
	}

	async getUserIfRefreshTokenMatched(userId: string, uuidRefreshToken: string) {
		const user =  await this.usersService.findUserById(userId);
		const check = await argon2.verify(user.refreshToken, uuidRefreshToken);
		if(check) {
			return user;
		}
		throw new ForbiddenException('Access Denied');
	}
}
