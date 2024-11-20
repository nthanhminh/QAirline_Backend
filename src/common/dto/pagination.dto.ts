import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationDto {
	@ApiProperty({ required: false, title: 'Search', description: 'Text search' })
	@IsOptional()
	search?: string;

	//pagination
	@ApiProperty({ example: 1, required: false })
	@IsOptional()
	page?: number;

	@ApiProperty({ example: 10, required: false })
	@IsOptional()
	pageSize?: number;
}
