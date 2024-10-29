import {
Module,
NestModule,
MiddlewareConsumer } from '@nestjs/common';
import { AppController } from "./app.controller";
import { AppService } from './app.service';
import { UtilityService } from './commom/util.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/user/user.entity';
import { ConfigModule } from '@nestjs/config';
import { VerifyTokenMiddleware } from "./middlewares/authentication";
import { SoftVerifyTokenMiddleware } from "./middlewares/softauth";
import { RedisModule } from './modules/redis/redis.module';
import { UserModule } from './modules/user/user.module';
import { UserController } from './modules/user/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Enables access to environment variables globally
    }),
    RedisModule,
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT, // Convert string to number
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User],
      synchronize: true, 
    }),
  ],
  controllers: [AppController],
  providers: [AppService, UtilityService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .forRoutes(
      UserController,
      )
    .apply(SoftVerifyTokenMiddleware)
    .forRoutes(
      UserController,
    );
  }
}

