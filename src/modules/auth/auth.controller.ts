import {
	Body,
	Controller,
	Patch,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestWithUser } from 'src/types/requests.type';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { EmailDto } from '../../common/dto/email.dto';
import { UpdatePasswordDto } from '@modules/auth/dto/update-password.dto';
import { AppResponse, ResponseMessage } from '../../types/common.type';
// import { User } from '@modules/users/entities/user.entity';
import { Observable } from 'rxjs';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { UpdatePasswordByCodeDto } from '@modules/auth/dto/update-password-by-code.dto';
import { SignInDto } from '@modules/auth/dto/sign-in.dto';
import { UpdateInfoDto } from '@modules/auth/dto/update-info.dto';
import { Response } from 'express';
import { CurrentUserDecorator } from '../../decorators/current-user.decorator';
import { VerifyCodeByEmailDto } from '@modules/auth/dto';
import { User } from '@modules/users/entity/user.entity';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
}
