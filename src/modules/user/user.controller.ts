import {
Controller,
Get,
Param,
Req,
HttpException,
HttpStatus,
NotFoundException,
UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiHeader } from '@nestjs/swagger';
import { IAuthenticatedReq } from "../../interfaces/authenticatedRequest";
import { UserService } from './user.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ status: 200, description: 'User details retrieved successfully' })

  @Get('/:userId')
  async getUser(
    @Param('user_id') user_id: string, 
    @Req() req: IAuthenticatedReq
  ) {
    try {
      const response = req.user.id;
      const user = await this.userService.getUserById(user_id);

      return {
        status: 'success',
        message: 'User details retrieved successfully',
        data: {
          userId: user.id,
          full_name: user.full_name,
          email: user.email,
          walletAddress: user.wallet_address,
          createdAt: user.created_at.toISOString(),
          updatedAt: user.updated_at.toISOString(),
        },
      };
    } catch (error) {
      // Re-throw specific exceptions to allow tests to catch them directly
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new HttpException('Failed to retrieve user details', HttpStatus.BAD_REQUEST);
    }
  }
}