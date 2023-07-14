import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const validationErrors =
      exception.getResponse()['message'] || exception.getResponse();

    console.log(validationErrors);

    let msg = 'An Error Occurred!';

    if (typeof validationErrors === 'object') {
      msg = validationErrors[0];
    }

    if (typeof validationErrors === 'string') {
      msg = validationErrors;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message: msg,
      errors: validationErrors,
    });
  }
}
