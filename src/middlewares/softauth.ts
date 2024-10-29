import { IAuthenticatedReq } from "./../interfaces/authenticatedRequest";
import { UserService } from "src/modules/user/user.service";
import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import { RedisService } from "../modules/redis/redis.service";
import CommonUtil from "src/utils/commons.util";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SoftVerifyTokenMiddleware implements NestMiddleware {
  private jwtSecretKey: string;

  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(RedisService) private readonly redisService: RedisService,

    private readonly configService: ConfigService
  ) {
    this.jwtSecretKey = configService.getOrThrow("JWT_SECRET");
  }

  async use(req: IAuthenticatedReq, res: Response, next: NextFunction) {
    try {
      if (!req.header("authorization")) {
        return next();
      }
      let user;
      const [signature, token] = req.header("authorization").split(" ");

      if (signature.toLowerCase() !== "bearer") return next();
      if (!token) return next();

      const decoded: any = await CommonUtil.verifyToken(
        token,
        this.jwtSecretKey
      );
      user = await this.userService.getUserById(decoded.id);

      if (!user) return next();

      req.user = user;

      return next();
    } catch (error) {
      console.error("SoftVerifyToken :: user error \n %o", error);
      return next();
    }
  }
}
