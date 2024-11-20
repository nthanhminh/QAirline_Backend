// import { User } from '@modules/users/entities/user.entity';
import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	HttpStatus,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token.interface';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import {
	accessTokenPrivateKey,
	refreshTokenPrivateKey,
} from 'src/constraints/jwt.constraint';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdatePasswordByCodeDto } from '@modules/auth/dto/update-password-by-code.dto';
import { AppResponse, ResponseMessage } from '../../types/common.type';
// import { MailService } from '@modules/mails/mail.service';
import { UpdatePasswordDto } from '@modules/auth/dto/update-password.dto';
import { SignInDto } from '@modules/auth/dto/sign-in.dto';
import { UpdateInfoDto } from '@modules/auth/dto/update-info.dto';
import { Observable } from 'rxjs';
import { SharedService } from '@modules/shared/shared.service';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenInterface } from '@modules/auth/interfaces/refresh-token.interface';
import * as moment from 'moment';
import { EEnvironmentLogin } from '@modules/auth/enums';
import { VerifyCodeByEmailDto } from '@modules/auth/dto';
import { ERolesUser, EStatusUser } from '@modules/users/enums/index.enum';
import { escapeRegex, getTokenFromHeader } from 'src/helper/string.helper';
import { EmailDto } from 'src/common/dto/email.dto';
import { User } from '@modules/users/entity/user.entity';
import { UsersService } from '../users/user.services';
import { CreateNewUserDto } from '@modules/users/dto/createNewUser.dto';
import { AuthDto, AuthResponseDto } from './dto/auth.dto';
import { VerifyService } from '@modules/queue/verify.service';

@Injectable()
export class AuthService {
	private SALT_ROUND = 11;
	private expTime;

	constructor(
		private configService: ConfigService,
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		// private readonly mailService: MailService,
		private readonly sharedService: SharedService,
		private readonly verifyService: VerifyService
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
		await this.verifyService.addVerifyJob({
		//   token: newUser.token,
			code: 1234
		});
		return {
			data: {
				...tokens,
				user: newUser
			}
		};
	  }
	
	  async signIn(data: AuthDto) : Promise<AppResponse<AuthResponseDto>> {
		const user = await this.usersService.findByEmail(data.email);
		if (!user) throw new BadRequestException('User does not exist');
		const passwordMatches = await argon2.verify(user.password, data.password);
		if (!passwordMatches)
		  throw new BadRequestException('Password is incorrect');
		const tokens = await this.getTokens(user.id, user.name, user.role);
		await this.updateRefreshToken(user.id, tokens.refreshToken);
		return {
			data: {
				...tokens,
				user
			}
		};
	  }
	
	  async logout(userId: string) {
		return this.usersService.update(userId, { refreshToken: null });
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
	
	//   async verifyEmail(token: string) {
	// 	const user = await this.usersService.findByToken(token);
	// 	return user != undefined;
	//   }
	
	  async updateRefreshToken(userId: string, refreshToken: string) {
		const hashedRefreshToken = await this.hashData(refreshToken);
		await this.usersService.update(userId, {
		  refreshToken: hashedRefreshToken,
		});
	  }
	
	  async getTokens(userId: string, username: string, role: string) {
		const [accessToken, refreshToken] = await Promise.all([
		  this.jwtService.signAsync(
			{
			  sub: userId,
			  username,
			  role,
			},
			{
			  secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
			  expiresIn: '15m',
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
	
	  async refreshTokens(userId: string, refreshToken: string) {
		const user = await this.usersService.findUserById(userId);
		if (!user || !user.refreshToken)
		  throw new ForbiddenException('Access Denied');
		const refreshTokenMatches = await argon2.verify(
		  user.refreshToken,
		  refreshToken,
		);
		if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
		const tokens = await this.getTokens(user.id, user.name, user.role);
		await this.updateRefreshToken(user.id, tokens.refreshToken);
		return tokens;
	  }
}
