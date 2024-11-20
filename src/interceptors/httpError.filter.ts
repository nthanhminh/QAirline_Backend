import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
	constructor(private i18n: I18nService) {}

	async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
		const context = host.switchToHttp();
		const response = context.getResponse();
		const statusCode = exception.getStatus
			? exception.getStatus()
			: HttpStatus.INTERNAL_SERVER_ERROR;
		let { message } = exception;
		let error: string = exception.message;

		if (exception.getResponse) {
			const eResponse = exception.getResponse() as {
				message: string[] | string;
				error: string;
			};
			message = Array.isArray(eResponse.message)
				? eResponse.message[0]
				: eResponse.message;
			error = eResponse.error;
		}

		message = message ? message : 'Maximum concurrent connections';
		const { messageInI18, path } = this._getPathAndMessage(message);

		const errorResponse = {
			statusCode,
			message: this._checkSpencialMessageError(message)
				? message
				: await this.i18n.translate(`${path}.${messageInI18}`),
			error: error || message,
		};

		response.status(statusCode).json(errorResponse);
	}

	_getPathAndMessage(message): { messageInI18; path } {
		const pathAndMessage = message.split('.');

		switch (pathAndMessage.length) {
			case 1:
				return {
					messageInI18: pathAndMessage[0],
					path: 'language',
				};
			case 2:
				return {
					messageInI18: pathAndMessage[1],
					path: pathAndMessage[0],
				};
			default:
				return {
					messageInI18: message,
					path: 'language',
				};
		}
	}

	_checkSpencialMessageError(message: string): boolean {
		return message.includes('エラー行：');
	}
}
