import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { GENERIC_RESPONSE_STATUS } from '../enums/commons.enum';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(
    private readonly adapterHost: HttpAdapterHost,
    private logger: Logger,
  ) {
    super(adapterHost.httpAdapter);
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let data;

    console.log('AllExceptionsFilter :: exception \n %o', exception);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception?.message ||
      exception?.response?.message ||
      exception?.message?.error ||
      exception?.toString();

    if (exception.status === HttpStatus.NOT_FOUND) {
      status = HttpStatus.NOT_FOUND;
    }

    if (exception.status === HttpStatus.SERVICE_UNAVAILABLE) {
      status = HttpStatus.SERVICE_UNAVAILABLE;
    }

    if (exception.status === HttpStatus.NOT_ACCEPTABLE) {
      status = HttpStatus.NOT_ACCEPTABLE;
    }

    if (exception.status === HttpStatus.EXPECTATION_FAILED) {
      status = HttpStatus.EXPECTATION_FAILED;
    }

    if (exception.status === HttpStatus.BAD_REQUEST) {
      status = HttpStatus.BAD_REQUEST;
    }

    if (exception.status === HttpStatus.UNAUTHORIZED) {
      status = HttpStatus.UNAUTHORIZED;
    }

    if ((exception?.statusCode ?? exception.status) === HttpStatus.CONFLICT) {
      status = HttpStatus.CONFLICT;
      message = exception.message || 'Duplicate found!';
    }

    if (exception.status === HttpStatus.UNPROCESSABLE_ENTITY) {
      console.log('422 exception');
      console.log(exception?.response?.message);
      status = HttpStatus.UNPROCESSABLE_ENTITY;

      // const constraints = exception.response?.message?.[0]?.constraints;
      // const value = Object.values(constraints)[0];

      data = exception.response?.message;
      message = 'Request could not be processed!';
    }

    if (message == 'ThrottlerException: Too Many Requests') {
      message =
        'You have attempted this operation too many times. Kindly wait a little and try again!';
    }

    response.status(status || HttpStatus.BAD_REQUEST).json({
      statusCode: GENERIC_RESPONSE_STATUS.FAILED,
      message: message || 'Operation Failed',
      data: data ?? null,
    });
  }
}
