import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ description: 'The full name of the user' })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password of the user', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'The wallet address of the user (optional)', required: false })
  @IsOptional()
  @IsString()
  wallet_address?: string;
}
