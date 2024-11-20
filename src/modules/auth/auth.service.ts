// import { User } from '@modules/users/entities/user.entity';
import {
	BadRequestException,
	ConflictException,
	HttpStatus,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token.interface';
import { ConfigService } from '@nestjs/config';
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
	) {
		this.expTime = this.configService.get<number>(
			'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
		);
	}

}
