import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { IAdminRequest } from '../interfaces/authenticatedRequest';
import { GENERIC_RESPONSE_STATUS } from '../enums/commons.enum';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  async use(req: IAdminRequest, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers['authorization'] as string;

      /**
       * NB: This is a very temp approach for authenticating an admin
       * TODO - create admin user that can authenticated here.
       */
      if (authHeader?.trim() !== process.env.SECURITY_KEY) {
        return this.handleAuthorizationError(
          res,
          'Authorization error occurred!',
        );
      }
      next();
    } catch (error) {
      Logger.error('authorization error occurred:', error);
      return this.handleAuthorizationError(
        res,
        'Authorization error occurred!',
      );
    }
  }

  private handleAuthorizationError(
    res: Response,
    message?: string,
    data?: any,
  ) {
    return res.status(401).send({
      statusCode: GENERIC_RESPONSE_STATUS.FAILED,
      message: message || 'Invalid Authorization',
      data: data || null,
    });
  }
}
