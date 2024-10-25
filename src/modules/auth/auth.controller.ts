import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './user.entity';
import { loginDto } from './dto/login-user.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // User Registration Endpoint
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth') // Reference the JWT Bearer auth set in Swagger config
  @ApiResponse({
    status: 201,
    description: 'User registered successfully and tokens allocated',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async register(@Body() registerUserDto: RegisterUserDto) {
    try {
      const user: User = await this.authService.register(registerUserDto);

      return {
        status_code: 201,
        message: 'User registered successfully and tokens allocated',
        user: {
          id: user.id,
          is_active: user.is_active,
          is_verified: user.is_verified,
          email: user.email,
          wallet_address: user.wallet_address,
          token_balance: user.token_balance,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // User Login Endpoint
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Login successful and tokens returned',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async login(@Body() loginDto: loginDto) {
    const { email, password } = loginDto;

    try {
      // Authenticate the user and get tokens
      const loginResponse = await this.authService.login(email, password);

      return {
        status_code: 200,
        message: 'Login successful',
        data: loginResponse.data,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Invalid credentials');
      } else {
        throw new BadRequestException('Login failed due to bad request');
      }
    }
  }
}