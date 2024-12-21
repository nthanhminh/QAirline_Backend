import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const body = request.body;

    this.logger.log(`[Request] ${method} ${url}`);
    this.logger.log('Request Body:', body);

    return next
      .handle()
      .pipe(
        tap((response) => {
          this.logger.log(`[Response] ${method} ${url}`);
          this.logger.log('Response Body:', response);
        }),
      );
  }
}
