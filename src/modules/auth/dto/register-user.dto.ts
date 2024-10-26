import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ example: 'Isaac John', description: 'The full name of the user' })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty({ example: 'isaacjohn@gmail.com', description: 'The email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'The password of the user', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '0xB32c3edcA357d1B494a71F277d054A22A8d6BC2b', description: 'The wallet address of the user (optional)', required: false })
  @IsOptional()
  @IsString()
  wallet_address?: string;
}
