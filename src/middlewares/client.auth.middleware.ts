import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import { GENERIC_RESPONSE_STATUS } from "src/enums/commons.enum";

@Injectable()
export class ClientAuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const channel = req.headers["channel"];

      if (!channel)
        return this.handleAuthorizationError(
          res,
          "Unable to authorize request!"
        );

      if (channel !== process.env.CHANNEL) {
        return this.handleAuthorizationError(res, "Unauthorized request!");
      }

      next();
    } catch (error) {
      Logger.error("Authorization error occurred:", error);
      throw error;
    }
  }

  private handleAuthorizationError(
    res: Response,
    message?: string,
    data?: any
  ) {
    return res.status(401).send({
      statusCode: GENERIC_RESPONSE_STATUS.FAILED,
      message: message || "Invalid Authorization",
      data: data || null,
    });
  }
}
