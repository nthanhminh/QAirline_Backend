import {
	Body,
	Controller,
	Get,
	Patch,
	Post,
	Query,
	Req,
	UseGuards,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { AuthDto, AuthResponseDto,} from './dto/auth.dto';
  import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
  } from '@nestjs/swagger';
import { CurrentUserDecorator } from 'src/decorators/current-user.decorator';
import { User } from '@modules/users/entity/user.entity';
import { CreateNewUserDto } from '@modules/users/dto/createNewUser.dto';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { VerifyService } from '@modules/queue/verify.service';
import { SendCodeDto, VerifyCodeDto } from './dto/sendCode.dto';
import { AppResponse, ResponseMessage } from 'src/types/common.type';
import { UpdatePasswordByCodeDto, UpdatePasswordDto } from './dto/updatePasswordByCode.dto';
import { JwtAccessTokenGuard } from './guards/jwt-access-token.guard';
  
  @ApiTags('auth')
  @Controller('auth')
  export class AuthController {
	constructor(
		private authService: AuthService,
		private readonly verifyService: VerifyService,
	) {}
  
	@Post('signup')
	@ApiOperation({ summary: 'Sign up a new user' })
	@ApiResponse({
	  status: 200,
	  description: 'User successfully signed in.',
	  type: AuthResponseDto,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	signup(@Body() createUserDto: CreateNewUserDto) {
	  try {
		return this.authService.signUp(createUserDto);
	  } catch (error) {
		console.log(error);
	  }
	}

	@Post('sendCode')
	async sendCode(@Body() dto: SendCodeDto) : Promise<ResponseMessage> {
		return {
			message: await this.authService.getCode(dto)
		}
	}
  
	@Post('verifyCode')
	async verifyCode(@Body() dto: VerifyCodeDto) : Promise<AppResponse<User>> {
		return {
			data: await this.authService.verifyCode(dto)
		}
	}

	@Post('logout')
	@UseGuards(JwtAccessTokenGuard)
	@ApiBearerAuth('token')
	async logout(@CurrentUserDecorator() user: User) : Promise<AppResponse<boolean>> {
		return {
			data: await this.authService.logout(user) ? true : false,
		}
	}

	@Post('updatePasswordByCode')
	async updatePasswordByCode(@Body() dto:UpdatePasswordByCodeDto): Promise<AppResponse<User>> {
		return {
			data: await this.authService.updatePasswordByCode(dto)
		}
	}

	@Patch('updatePassword')
	@ApiBearerAuth('token')
	@UseGuards(JwtAccessTokenGuard)
	async updatePassword(@Body() dto: UpdatePasswordDto, @CurrentUserDecorator() user: User) : Promise<AppResponse<User>> {
		return {
			data: await this.authService.updatePassword(dto, user)
		}
	}

	@Post('signin')
	@ApiOperation({ summary: 'Sign in an existing user' })
	@ApiResponse({
	  status: 200,
	  description: 'User successfully signed in.',
	  type: AuthResponseDto,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	signin(@Body() data: AuthDto) {
	  return this.authService.signIn(data);
	}
  
	@UseGuards(JwtRefreshTokenGuard)
	@Get('refresh')
	@ApiOperation({ summary: 'Refresh tokens using the refresh token' })
	@ApiResponse({
	  status: 200,
	  description: 'User successfully signed in.',
	  type: AuthResponseDto,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiBearerAuth('refreshToken')
	async refreshTokens(@CurrentUserDecorator() user:User) : Promise<AppResponse<{accessToken: string}>> {
	  	return { 
			data: await this.authService.refreshTokens(user),
		}
	}
  
	@Get('verify')
	async verifyEmail() {
		await this.verifyService.addVerifyJob({
			code: 1234
		});
	}
  }
  