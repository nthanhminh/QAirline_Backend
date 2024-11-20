export interface IPagination<T = any> {
	content: {
		items: T[];
		total: number;
		page: number;
		perPage: number;
		totalPage: number;
	};
}
