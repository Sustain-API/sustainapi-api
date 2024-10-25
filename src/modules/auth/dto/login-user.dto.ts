import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class loginDto{
  @ApiProperty({ example: 'isaacjohn@gmail.com',description: 'The email of the user' })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase())
  email?: string;

  @ApiProperty({ example: 'password123', description: 'The password of the user', minLength: 6 })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}