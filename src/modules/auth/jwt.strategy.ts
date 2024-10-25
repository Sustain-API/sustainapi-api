import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
      ignoreExpiration: false, // Expire tokens automatically
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default_secret', // Use secret from config
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email }; // Attach user info to the request object
  }
}
