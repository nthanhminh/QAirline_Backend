import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class DownloadZipDto {
	@ApiProperty({
		default: [
			'キャラクター1.png',
			'キャラクター2.png',
			'キャラクター3.png',
			'キャラクター4.png',
			'キャラクター5.png',
			'キャラクター6.png',
			'キャラクター7.png',
			'キャラクター8.png',
			'キャラクター9.png',
			'キャラクター10.png',
			'キャラクター11.png',
			'キャラクター12.png',
		],
	})
	@IsOptional()
	imagesExists: string[];
}
