import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { RedisModule } from "../redis/redis.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  RedisModule
],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
