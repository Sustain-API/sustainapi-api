import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { UtilityService } from 'src/commom/util.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity'; // Import user entity
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module'; // Import UserModule
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
       
      }),
    }),
    UserModule,
    TypeOrmModule.forFeature([User]),
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    UtilityService,
  ],
  exports: [AuthService],
})
export class AuthModule {}