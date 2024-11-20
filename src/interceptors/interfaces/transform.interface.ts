export interface IResponse<T = any> {
	message: string;
	data: T;
}
