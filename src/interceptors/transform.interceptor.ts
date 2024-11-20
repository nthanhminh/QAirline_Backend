import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponse } from './interfaces';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
	intercept(
		context: ExecutionContext,
		next: CallHandler<any>,
	): Observable<any> | Promise<Observable<any>> {
		return next.handle().pipe(
			map(({ data, message }: IResponse) => {
				return {
					statusCode: context.switchToHttp().getResponse().statusCode,
					data,
					message,
				};
			}),
		);
	}
}
