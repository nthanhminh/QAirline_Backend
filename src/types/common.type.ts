import { ApiProperty } from '@nestjs/swagger';

export enum SORT_TYPE {
	'DESC' = 'desc',
	'ASC' = 'acs',
}

export class ResponseMessage {
	@ApiProperty()
	message: string;
}

export class AppResponse<T> {
	@ApiProperty()
	data: T;
}

export class AppResponseMessage<T> {
	@ApiProperty()
	message: string;

	@ApiProperty()
	data: T;
}

export class LoginResponse {
	@ApiProperty()
	accessToken: string;

	@ApiProperty()
	refreshToken: string;
}

export type FindAllResponse<T> = { count: number; items: T[] };

export type FindAllResponseWithPagination<T> = FindAllResponse<T> & {
	totalPage: number;
};

export type SortParams = { sort_by: string; sort_type: SORT_TYPE };

export type SearchParams = { keywork: string; field: string };

export type PaginateParams = { offset: number; limit: number };
