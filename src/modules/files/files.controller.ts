import {
	Controller,
	Get,
	HttpStatus,
	ParseFilePipeBuilder,
	Post,
	Query,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Roles } from '../../decorators/roles.decorator';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { ERolesUser } from '@modules/users/enums/index.enum';
import { trimfilenametobytes } from 'src/helper/filter-file-upload.helper';

@Controller('files')
@ApiTags('files')
// @ApiBearerAuth('token')
// @UseGuards(JwtAccessTokenGuard)
// @Roles(ERolesUser.ADMIN, ERolesUser.STAFF)
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post('')
	@ApiOperation({
		summary: 'Upload',
	})
	@UseInterceptors(
		FilesInterceptor('files', 50, {
			limits: {
				fileSize: 1024 * 1024 * 5, // max file size: 5MB
			},
			storage: diskStorage({
				destination: './assets/uploads',
				filename: (req, file, callback) => {
					const random = Array(6)
						.fill(null)
						.map(() => Math.round(Math.random() * 6).toString(6))
						.join('');

					const [name, mineType] = file.originalname.split('.');
					const nameTrim = trimfilenametobytes(name, 200);

					const filename = `${random}_${nameTrim}.${mineType}`;
					return callback(null, filename);
				},
			}),
		}),
	)
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				files: {
					type: 'array', // 👈  array of files
					items: {
						type: 'string',
						format: 'binary',
					},
				},
			},
		},
	})
	uploadFiles(
		@UploadedFiles(
			new ParseFilePipeBuilder()
				.addFileTypeValidator({
					fileType: /(jpg|jpeg|png|gif|bmp|webp|mp4|webm|ogv|mov|avi|mkv)$/,
				})
				.build({
					errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
				}),
		)
		files,
	) {
		const imageUrl: string[] = []
		for(const file of files) {
			const normalizedPath = file.path.replace(/\\/g, '/');
			imageUrl.push(normalizedPath);
		}
		return {
			data: imageUrl,
		}
	}

	@Roles(ERolesUser.ADMIN)
	@UseGuards(RolesGuard)
	@ApiBearerAuth('token')
	@UseGuards(JwtAccessTokenGuard)
	@ApiOperation({
		summary: 'List',
	})
	@Get()
	async findAll() {
		return {
			data: await this.filesService.findAll(),
		};
	}
}
